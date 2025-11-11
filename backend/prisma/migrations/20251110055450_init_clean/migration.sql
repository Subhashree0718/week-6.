-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'AT_RISK', 'BLOCKED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "objectives" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "Status" NOT NULL DEFAULT 'IN_PROGRESS',
    "ownerId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "objectives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "key_results" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "current" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT '%',
    "objectiveId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "key_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KRUpdate" (
    "id" TEXT NOT NULL,
    "progress" DOUBLE PRECISION,
    "blockers" TEXT,
    "note" TEXT,
    "keyResultId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KRUpdate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "updates" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "progress" DOUBLE PRECISION,
    "blockers" TEXT,
    "objectiveId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "teamId" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "team_members_userId_teamId_key" ON "team_members"("userId", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "team_invitations_token_key" ON "team_invitations"("token");

-- CreateIndex
CREATE UNIQUE INDEX "team_invitations_teamId_email_key" ON "team_invitations"("teamId", "email");

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "objectives" ADD CONSTRAINT "objectives_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "key_results" ADD CONSTRAINT "key_results_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "objectives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KRUpdate" ADD CONSTRAINT "KRUpdate_keyResultId_fkey" FOREIGN KEY ("keyResultId") REFERENCES "key_results"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KRUpdate" ADD CONSTRAINT "KRUpdate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "updates" ADD CONSTRAINT "updates_objectiveId_fkey" FOREIGN KEY ("objectiveId") REFERENCES "objectives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "updates" ADD CONSTRAINT "updates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_invitations" ADD CONSTRAINT "team_invitations_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
