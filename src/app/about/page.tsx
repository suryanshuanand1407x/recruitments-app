import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">About Us</CardTitle>
          <CardDescription className="text-center text-lg mt-2">
            Connecting Top Talent with Great Opportunities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We&apos;re on a mission to revolutionize the recruitment process by leveraging cutting-edge technology 
              and artificial intelligence. Our platform brings together talented candidates and forward-thinking 
              recruiters, making the hiring process more efficient and effective.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">What We Offer</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="text-xl font-medium">For Candidates</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>AI-powered resume parsing and analysis</li>
                  <li>Personalized job recommendations</li>
                  <li>Direct connection with top recruiters</li>
                  <li>Easy application process</li>
                  <li>Career growth opportunities</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-medium">For Recruiters</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Advanced candidate matching</li>
                  <li>Automated resume screening</li>
                  <li>Efficient hiring workflow</li>
                  <li>Quality talent pool</li>
                  <li>Data-driven recruitment insights</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Technology</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              We use state-of-the-art technologies including OpenAI&apos;s GPT models for resume parsing,
              Next.js for a seamless user experience, and advanced algorithms for job matching. Our
              platform is built with security and scalability in mind, ensuring a reliable service
              for both candidates and recruiters.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Get Started</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Whether you&apos;re a job seeker looking for your next opportunity or a recruiter searching
              for top talent, our platform is designed to help you succeed. Sign in today to experience
              the future of recruitment.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
} 