# AI-Powered Features in OKR Tracker

## Overview
The OKR Tracker now includes AI-powered summarization to help you quickly understand progress, identify blockers, and get actionable recommendations.

## Features

### 📊 AI-Generated Summaries
Get intelligent summaries of your objectives that include:
- **Overall Progress**: Consolidated view of achievements and milestones
- **Key Highlights**: Important developments and wins
- **Blockers & Risks**: Identified obstacles and potential issues
- **Recommended Next Steps**: AI-suggested actions to maintain momentum

## How to Use

### Generate a Summary

1. **Navigate to Objective Detail Page**
   - Click on any objective card from Dashboard or Objectives page
   
2. **Find the AI Summary Section**
   - Located between "Overall Progress" and "Key Results" sections
   - Displays a purple-themed card with sparkle icon ✨

3. **Generate Summary**
   - Click **"Generate AI Summary"** button
   - Wait 3-5 seconds while AI analyzes your data
   - View the comprehensive summary

4. **Regenerate if Needed**
   - Click **"Regenerate"** button to get a fresh analysis
   - Useful after adding new updates or progress

## What Gets Analyzed

The AI analyzes:
- ✅ All updates and progress notes
- ✅ Key results and their progress
- ✅ Blockers mentioned in updates
- ✅ Team activity and contributions
- ✅ Timeline and deadlines

## Requirements

### Backend Setup
1. **OpenAI API Key** is required
2. Set in environment variable: `OPENAI_API_KEY`
3. Add to `.env` file in backend folder:
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   ```

### Getting OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and add to your `.env` file

## Technical Details

### Model Used
- **GPT-3.5-turbo**: Fast and cost-effective
- **Temperature**: 0.7 (balanced creativity)
- **Max Tokens**: 500 (3-4 paragraph summary)

### API Endpoint
```
GET /api/updates/objectives/:objectiveId/summary
```

### Cost Considerations
- Each summary generation costs ~$0.001-0.002
- Recommended to use when meaningful updates exist
- Consider implementing rate limiting for production

## Best Practices

1. **Add Quality Updates**
   - More detailed updates = better summaries
   - Include specific metrics and blockers
   - Mention team members and contributions

2. **Regular Usage**
   - Generate summaries weekly for reviews
   - Before team meetings or stand-ups
   - When onboarding new team members

3. **Regenerate After Major Changes**
   - When key milestones are reached
   - After adding multiple updates
   - When priorities shift

## Troubleshooting

### "OpenAI is not configured" Error
- **Solution**: Add `OPENAI_API_KEY` to backend `.env` file
- Restart backend container after adding the key

### "Failed to generate summary" Error
- **Check**: OpenAI API key is valid and has credits
- **Check**: Internet connection from backend container
- **Try**: Regenerate after a few seconds

### Empty or Generic Summary
- **Issue**: Not enough data to analyze
- **Solution**: Add more detailed updates and progress notes
- **Solution**: Ensure key results have current values

## Future Enhancements

Planned features:
- 🔮 Predictive risk analysis
- 📈 Trend identification
- 💡 Smart recommendations
- 🎯 Automatic action items
- 📧 Email summaries
- 🤖 Slack/Teams integration

## Support

For issues or questions:
1. Check backend logs: `docker logs okr_backend`
2. Verify OpenAI API key is set correctly
3. Ensure backend has internet access
4. Review OpenAI API usage and limits

---

**Note**: AI summaries are suggestions based on available data. Always review and validate recommendations before taking action.
