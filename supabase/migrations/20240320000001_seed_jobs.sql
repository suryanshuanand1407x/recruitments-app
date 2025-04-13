-- Insert sample jobs
INSERT INTO public.jobs (
  title,
  company,
  location,
  description,
  requirements,
  salary,
  employment_type,
  status
) VALUES
(
  'Senior Full Stack Developer',
  'TechCorp',
  'San Francisco, CA',
  'We are looking for a Senior Full Stack Developer to join our team. The ideal candidate will have experience with React, Node.js, and PostgreSQL.',
  ARRAY['React', 'Node.js', 'PostgreSQL', 'TypeScript', 'AWS'],
  '$150,000 - $180,000 per year',
  'Full-time',
  'active'
),
(
  'Machine Learning Engineer',
  'AI Solutions',
  'Remote',
  'Join our team as a Machine Learning Engineer to work on cutting-edge AI projects. Experience with TensorFlow and PyTorch required.',
  ARRAY['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning'],
  '$140,000 - $170,000 per year',
  'Full-time',
  'active'
),
(
  'DevOps Engineer',
  'Cloud Systems',
  'New York, NY',
  'We are seeking a DevOps Engineer to help us build and maintain our cloud infrastructure.',
  ARRAY['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
  '$130,000 - $160,000 per year',
  'Full-time',
  'active'
); 