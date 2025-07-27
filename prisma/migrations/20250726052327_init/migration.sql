-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "photo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "googleUserId" TEXT,
    "languageId" TEXT NOT NULL DEFAULT 'en',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoogleUser" (
    "id" TEXT NOT NULL,
    "googleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoogleUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnswers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "goalOptionId" TEXT,
    "jobOptionId" TEXT,
    "educationOptionId" TEXT,

    CONSTRAINT "UserAnswers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LanguageOption" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "LanguageOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LanguageLabel" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "languageOptionId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "LanguageLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalOption" (
    "id" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "GoalOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalLabel" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "goalOptionId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "GoalLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleOption" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "RoleOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleLabel" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "roleOptionId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "RoleLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobOption" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "JobOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobLabel" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "jobOptionId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "JobLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationOption" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "EducationOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EducationLabel" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "educationOptionId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "EducationLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseDetails" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "time" TEXT,
    "languageId" TEXT NOT NULL,
    "courseId" TEXT,

    CONSTRAINT "CourseDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseTag" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "CourseTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseTagLabel" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "courseTagId" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "CourseTagLabel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseTagCustom" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,

    CONSTRAINT "CourseTagCustom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoleOptionToUserAnswers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_RoleOptionToUserAnswers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CourseDetailsToCourseTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseDetailsToCourseTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CourseDetailsToCourseTagCustom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CourseDetailsToCourseTagCustom_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_googleUserId_key" ON "User"("googleUserId");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleUser_googleId_key" ON "GoogleUser"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAnswers_userId_key" ON "UserAnswers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LanguageOption_value_key" ON "LanguageOption"("value");

-- CreateIndex
CREATE UNIQUE INDEX "LanguageLabel_languageOptionId_languageId_key" ON "LanguageLabel"("languageOptionId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "GoalOption_value_key" ON "GoalOption"("value");

-- CreateIndex
CREATE UNIQUE INDEX "GoalLabel_goalOptionId_languageId_key" ON "GoalLabel"("goalOptionId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleOption_value_key" ON "RoleOption"("value");

-- CreateIndex
CREATE UNIQUE INDEX "RoleLabel_roleOptionId_languageId_key" ON "RoleLabel"("roleOptionId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "JobOption_value_key" ON "JobOption"("value");

-- CreateIndex
CREATE UNIQUE INDEX "JobLabel_jobOptionId_languageId_key" ON "JobLabel"("jobOptionId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "EducationOption_value_key" ON "EducationOption"("value");

-- CreateIndex
CREATE UNIQUE INDEX "EducationLabel_educationOptionId_languageId_key" ON "EducationLabel"("educationOptionId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseDetails_courseId_languageId_key" ON "CourseDetails"("courseId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "CourseTag_value_key" ON "CourseTag"("value");

-- CreateIndex
CREATE UNIQUE INDEX "CourseTagLabel_courseTagId_languageId_key" ON "CourseTagLabel"("courseTagId", "languageId");

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");

-- CreateIndex
CREATE INDEX "_RoleOptionToUserAnswers_B_index" ON "_RoleOptionToUserAnswers"("B");

-- CreateIndex
CREATE INDEX "_CourseDetailsToCourseTag_B_index" ON "_CourseDetailsToCourseTag"("B");

-- CreateIndex
CREATE INDEX "_CourseDetailsToCourseTagCustom_B_index" ON "_CourseDetailsToCourseTagCustom"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_googleUserId_fkey" FOREIGN KEY ("googleUserId") REFERENCES "GoogleUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "LanguageOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswers" ADD CONSTRAINT "UserAnswers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswers" ADD CONSTRAINT "UserAnswers_goalOptionId_fkey" FOREIGN KEY ("goalOptionId") REFERENCES "GoalOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswers" ADD CONSTRAINT "UserAnswers_jobOptionId_fkey" FOREIGN KEY ("jobOptionId") REFERENCES "JobOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnswers" ADD CONSTRAINT "UserAnswers_educationOptionId_fkey" FOREIGN KEY ("educationOptionId") REFERENCES "EducationOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageLabel" ADD CONSTRAINT "LanguageLabel_languageOptionId_fkey" FOREIGN KEY ("languageOptionId") REFERENCES "LanguageOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageLabel" ADD CONSTRAINT "LanguageLabel_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "LanguageOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalLabel" ADD CONSTRAINT "GoalLabel_goalOptionId_fkey" FOREIGN KEY ("goalOptionId") REFERENCES "GoalOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalLabel" ADD CONSTRAINT "GoalLabel_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "LanguageOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleLabel" ADD CONSTRAINT "RoleLabel_roleOptionId_fkey" FOREIGN KEY ("roleOptionId") REFERENCES "RoleOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleLabel" ADD CONSTRAINT "RoleLabel_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "LanguageOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobLabel" ADD CONSTRAINT "JobLabel_jobOptionId_fkey" FOREIGN KEY ("jobOptionId") REFERENCES "JobOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobLabel" ADD CONSTRAINT "JobLabel_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "LanguageOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationLabel" ADD CONSTRAINT "EducationLabel_educationOptionId_fkey" FOREIGN KEY ("educationOptionId") REFERENCES "EducationOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EducationLabel" ADD CONSTRAINT "EducationLabel_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "LanguageOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseDetails" ADD CONSTRAINT "CourseDetails_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "LanguageOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseDetails" ADD CONSTRAINT "CourseDetails_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTagLabel" ADD CONSTRAINT "CourseTagLabel_courseTagId_fkey" FOREIGN KEY ("courseTagId") REFERENCES "CourseTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTagLabel" ADD CONSTRAINT "CourseTagLabel_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "LanguageOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseTagCustom" ADD CONSTRAINT "CourseTagCustom_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "LanguageOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleOptionToUserAnswers" ADD CONSTRAINT "_RoleOptionToUserAnswers_A_fkey" FOREIGN KEY ("A") REFERENCES "RoleOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoleOptionToUserAnswers" ADD CONSTRAINT "_RoleOptionToUserAnswers_B_fkey" FOREIGN KEY ("B") REFERENCES "UserAnswers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseDetailsToCourseTag" ADD CONSTRAINT "_CourseDetailsToCourseTag_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseDetailsToCourseTag" ADD CONSTRAINT "_CourseDetailsToCourseTag_B_fkey" FOREIGN KEY ("B") REFERENCES "CourseTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseDetailsToCourseTagCustom" ADD CONSTRAINT "_CourseDetailsToCourseTagCustom_A_fkey" FOREIGN KEY ("A") REFERENCES "CourseDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourseDetailsToCourseTagCustom" ADD CONSTRAINT "_CourseDetailsToCourseTagCustom_B_fkey" FOREIGN KEY ("B") REFERENCES "CourseTagCustom"("id") ON DELETE CASCADE ON UPDATE CASCADE;
