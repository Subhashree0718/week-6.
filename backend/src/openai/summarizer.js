import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PYTHON_SCRIPT_PATH = path.resolve(__dirname, '../../scripts/generate_summary.py');
const PYTHON_BIN = process.env.PYTHON_BIN || 'python3';

// Explicit Gemini API key fallback provided by the user
const EMBEDDED_GEMINI_API_KEY = 'AIzaSyC2BjCOYY-Fx0Ghbf2GP4-uEgEG7tI6AAY';

const PLACEHOLDER_KEY_HINTS = [
  'your-gemini-api-key',
  'your-openai-api-key',
  'replace-me',
  'example-key',
];

class SummarizerService {
  constructor() {
    this.pythonAvailable = fs.existsSync(PYTHON_SCRIPT_PATH);
    if (!this.pythonAvailable) {
      logger.warn('Python summarizer script not found. Falling back to local summaries.');
    }
  }

  async generateWeeklySummary(updates, objective = null) {
    if (!this.hasMeaningfulData(updates, objective)) {
      return 'No data available for summary generation. Please add key results or progress updates to generate insights.';
    }

    if (this.pythonAvailable) {
      try {
        const result = await this.invokePythonSummarizer({ updates, objective });
        if (result?.summary) {
          if (result.error) {
            logger.error('Python summarizer reported error:', result.error);
          }
          return result.summary;
        }
        logger.warn('Python summarizer returned no summary. Falling back to local renderer.');
      } catch (error) {
        logger.error('Python summarizer failed:', error);
      }
    }

    return this.generateFallbackSummary(
      updates,
      objective,
      'Summary generated using available data because the AI service is currently unavailable.'
    );
  }

  generateFallbackSummary(updates = [], objective = null, reason = null) {
    const sections = [];
    sections.push(reason || 'Summary generated using available data because the AI service is not configured.');

    if (objective) {
      const start = objective.startDate ? new Date(objective.startDate).toLocaleDateString() : 'N/A';
      const end = objective.endDate ? new Date(objective.endDate).toLocaleDateString() : 'N/A';
      sections.push([
        `Objective: ${objective.title}`,
        `Status: ${objective.status}`,
        `Overall Progress: ${objective.progress}%`,
        `Timeline: ${start} - ${end}`,
      ].join('\n'));
    }

    if (objective?.keyResults?.length) {
      const keyResultLines = objective.keyResults.map((kr, index) => {
        const progress = kr.target > 0 ? Math.round((kr.current / kr.target) * 100) : 0;
        return `${index + 1}. ${kr.title} — ${progress}% towards ${kr.target} ${kr.unit}`;
      });
      sections.push(`Key Results Snapshot:\n${keyResultLines.join('\n')}`);
    }

    if (updates && updates.length) {
      const sortedUpdates = [...updates].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const latest = sortedUpdates[0];
      const latestAuthor = latest.user?.name || latest.user?.email || 'Unknown member';
      const latestDate = latest.createdAt ? new Date(latest.createdAt).toLocaleDateString() : 'Unknown date';
      sections.push(`Most Recent Update (${latestDate} by ${latestAuthor}):\n${latest.content || 'No content provided.'}`);

      const progressUpdates = sortedUpdates.filter((update) => typeof update.progress === 'number');
      if (progressUpdates.length) {
        const latestProgress = progressUpdates[0].progress;
        const avgProgress = Math.round(
          progressUpdates.reduce((total, update) => total + update.progress, 0) / progressUpdates.length
        );
        sections.push(
          `Progress signals: latest reported progress is ${latestProgress}%, with an average of ${avgProgress}% across ` +
          `${progressUpdates.length} update${progressUpdates.length > 1 ? 's' : ''}.`
        );
      }

      const blockers = [...new Set(sortedUpdates
        .map((update) => update.blockers?.trim())
        .filter(Boolean))];
      if (blockers.length) {
        sections.push(`Blockers to watch:\n${blockers.map((blocker) => `- ${blocker}`).join('\n')}`);
      }
    } else {
      sections.push('No progress updates have been logged yet. Encourage the team to share updates to enrich future summaries.');
    }

    return sections.join('\n\n');
  }

  hasMeaningfulData(updates = [], objective = null) {
    if (Array.isArray(updates) && updates.length > 0) {
      return true;
    }

    if (!objective) {
      return false;
    }

    if (Array.isArray(objective?.keyResults) && objective.keyResults.length > 0) {
      return true;
    }

    const hasDetails = [
      objective.title,
      objective.description,
      objective.progress,
      objective.status,
      objective.startDate,
      objective.endDate,
    ].some((value) => value !== undefined && value !== null && value !== '');

    return Boolean(hasDetails);
  }

  invokePythonSummarizer(payload) {
    if (!fs.existsSync(PYTHON_SCRIPT_PATH)) {
      throw new Error('Summarizer script not found.');
    }

    return new Promise((resolve, reject) => {
      const env = { ...process.env };
      const effectiveKey = this.getEffectiveApiKey();
      if (effectiveKey) {
        env.GEMINI_API_KEY = effectiveKey;
        if (!env.OPENAI_API_KEY) {
          env.OPENAI_API_KEY = effectiveKey;
        }
      }

      const child = spawn(PYTHON_BIN, [PYTHON_SCRIPT_PATH], {
        env,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('error', (error) => {
        reject(error);
      });

      child.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(stderr || `Python summarizer exited with code ${code}`));
        }

        try {
          const parsed = JSON.parse(stdout.trim() || '{}');
          resolve(parsed);
        } catch (error) {
          reject(error);
        }
      });

      try {
        child.stdin.write(JSON.stringify(payload));
        child.stdin.end();
      } catch (error) {
        child.kill();
        reject(error);
      }
    });
  }

  getEffectiveApiKey() {
    const envKey = process.env.GEMINI_API_KEY;
    if (this.isUsableKey(envKey)) {
      return envKey.trim();
    }

    if (this.isUsableKey(EMBEDDED_GEMINI_API_KEY)) {
      return EMBEDDED_GEMINI_API_KEY.trim();
    }

    return null;
  }

  isUsableKey(key) {
    if (!key) {
      return false;
    }

    const normalized = key.toLowerCase();
    if (PLACEHOLDER_KEY_HINTS.some((hint) => normalized.includes(hint))) {
      return false;
    }

    return key.trim().length >= 20;
  }
}

export default new SummarizerService();
