import { Link } from "components/documentation";

const QAS = [
  {
    question:
      "Q1. What is a resume builder? Why resume builder is better than resume template doc?",
    answer: (
      <>
        <p>
          There are two ways to create a resume today. One option is to use a
          resume template, such as an office/google doc, and customize it
          according to your needs. The other option is to use a resume builder,
          an online tool that allows you to input your information and
          automatically generates a resume for you.
        </p>
        <p>
          Using a resume template requires manual formatting work, like copying
          and pasting text sections and adjusting spacing, which can be
          time-consuming and error-prone. It is easy to run into formatting
          issues, such as using different bullet points or font styles after
          copying and pasting. On the other hand, a resume builder like
          Apply Wizz saves time and prevents formatting mistakes by
          automatically formatting the resume. It also offers the convenience of
          easily changing font types or sizes with a simple click. In summary, a
          resume builder is easier to use compared to a resume template.
        </p>
      </>
    ),
  },
  {
    question:
      "Q2. What uniquely sets Apply Wizz apart from other resume builders and templates?",
    answer: (
      <>
        <p>
          Other than Apply Wizz, there are some great free resume builders out
          there, e.g. <Link href="https://rxresu.me/">Reactive Resume</Link>,{" "}
          <Link href="https://flowcv.com/">FlowCV</Link>. However, Apply Wizz
          stands out with 2 distinctive features:
        </p>{" "}
        <p>
          <span className="font-semibold">
            1. Apply Wizz is designed specifically for the U.S. job market and
            best practices.
          </span>
          <br />
          Unlike other resume builders that target a global audience and offer
          many customization options, Apply Wizz intentionally only offers
          options that are aligned with U.S. best practices. For example, it
          excludes the option to add a profile picture to avoid bias and
          discrimination. It offers only the core sections, e.g. profile, work
          experience, education, and skills, while omitting unnecessary sections
          like references. Additionally, Apply Wizz only offers a top down
          single column resume design as opposed to two column design, because
          single column design works best for ATS. <br />{" "}
        </p>
        <p>
          <span className="font-semibold">
            2. Apply Wizz is super privacy focused.
          </span>{" "}
          <br />
          While other resume builders may require email sign up and store user
          data in their databases, Apply Wizz believes that resume data should
          remain private and accessible only on user's local machine. Therefore,
          Apply Wizz doesn't require sign up to use the app, and all inputted
          data is stored in user's browser that only user has access to.
        </p>
      </>
    ),
  },
  {
    question: "Q3. Who created Apply Wizz and why?",
    answer: (
      <p>
        Apply Wizz was created by a team of experienced professionals who
        understand the challenges of job hunting in today's competitive market.
        As professionals who have navigated various career transitions, we
        recognized the common struggles people face when creating effective
        resumes. Through years of recruiting experience and helping countless
        individuals improve their resumes, we identified the need for a tool
        that combines industry best practices with advanced technology. Apply Wizz
        integrates cutting-edge ATS analysis, professional design principles,
        and user-friendly features to help job seekers create compelling resumes
        that stand out to both recruiters and applicant tracking systems. Our
        goal is to empower every job seeker with the tools they need to present
        their best professional self and land their dream job.
      </p>
    ),
  },
  {
    question: "Q4. How can I support Apply Wizz?",
    answer: (
      <>
        <p>
          The best way to support Apply Wizz is to share your thoughts and
          feedback with us to help further improve it. You can send us an email
          at{" "}
          <Link href="mailto:support@applywizz.com">support@applywizz.com</Link>{" "}
          or reach out to us through our contact form. Whether you love our
          features or have suggestions for improvement, we would love to hear
          from you.
        </p>
        <p>
          Another great way to support Apply Wizz is by spreading the word.
          Share it with your friends, on social media platforms, or with your
          school's career center. Our goal is to reach more people who struggle
          with creating their resume, and your word-of-mouth support would be
          greatly appreciated. Help us build a community of successful job
          seekers by recommending Apply Wizz to others who could benefit from
          our advanced resume building and ATS optimization features.
        </p>
      </>
    ),
  },
];

export const QuestionsAndAnswers = () => {
  return (
    <section className="mx-auto max-w-3xl divide-y divide-gray-300 lg:mt-4 lg:px-2">
      <h2 className="text-center text-3xl font-bold">Questions & Answers</h2>
      <div className="mt-6 divide-y divide-gray-300">
        {QAS.map(({ question, answer }) => (
          <div key={question} className="py-6">
            <h3 className="font-semibold leading-7">{question}</h3>
            <div className="mt-3 grid gap-2 leading-7 text-gray-600">
              {answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
