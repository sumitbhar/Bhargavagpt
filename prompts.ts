export interface PromptTemplate {
  id: string;
  category: PromptCategory;
  title: string; // Translation key
  description: string; // Translation key
  template: string; // Translation key
}

export enum PromptCategory {
  PRODUCTIVITY = 'productivity',
  CREATIVE = 'creative',
  MARKETING = 'marketing',
  TECHNOLOGY = 'technology',
  HR = 'human_resources',
}

export const PROMPT_LIBRARY: PromptTemplate[] = [
  // Productivity
  {
    id: 'email-professional',
    category: PromptCategory.PRODUCTIVITY,
    title: 'prompt_email_professional_title',
    description: 'prompt_email_professional_desc',
    template: 'prompt_email_professional_template',
  },
  {
    id: 'summarize-text',
    category: PromptCategory.PRODUCTIVITY,
    title: 'prompt_summarize_text_title',
    description: 'prompt_summarize_text_desc',
    template: 'prompt_summarize_text_template',
  },
  {
    id: 'brainstorm-ideas',
    category: PromptCategory.PRODUCTIVITY,
    title: 'prompt_brainstorm_ideas_title',
    description: 'prompt_brainstorm_ideas_desc',
    template: 'prompt_brainstorm_ideas_template',
  },
  // Marketing
  {
    id: 'social-media-post',
    category: PromptCategory.MARKETING,
    title: 'prompt_social_media_post_title',
    description: 'prompt_social_media_post_desc',
    template: 'prompt_social_media_post_template',
  },
  {
    id: 'blog-post-outline',
    category: PromptCategory.MARKETING,
    title: 'prompt_blog_post_title',
    description: 'prompt_blog_post_desc',
    template: 'prompt_blog_post_template',
  },
  {
    id: 'ad-copy',
    category: PromptCategory.MARKETING,
    title: 'prompt_ad_copy_title',
    description: 'prompt_ad_copy_desc',
    template: 'prompt_ad_copy_template',
  },
  // Technology
  {
    id: 'explain-code',
    category: PromptCategory.TECHNOLOGY,
    title: 'prompt_explain_code_title',
    description: 'prompt_explain_code_desc',
    template: 'prompt_explain_code_template',
  },
  {
    id: 'write-sql-query',
    category: PromptCategory.TECHNOLOGY,
    title: 'prompt_write_sql_query_title',
    description: 'prompt_write_sql_query_desc',
    template: 'prompt_write_sql_query_template',
  },
  {
    id: 'regex-generator',
    category: PromptCategory.TECHNOLOGY,
    title: 'prompt_regex_generator_title',
    description: 'prompt_regex_generator_desc',
    template: 'prompt_regex_generator_template',
  },
  // HR
  {
    id: 'job-description',
    category: PromptCategory.HR,
    title: 'prompt_job_description_title',
    description: 'prompt_job_description_desc',
    template: 'prompt_job_description_template',
  },
  {
    id: 'interview-questions',
    category: PromptCategory.HR,
    title: 'prompt_interview_questions_title',
    description: 'prompt_interview_questions_desc',
    template: 'prompt_interview_questions_template',
  },
];
