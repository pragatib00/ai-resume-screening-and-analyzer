import {
  FileText,
  Brain,
  BarChart3,
  Trophy
} from "lucide-react";


function HowItWorks() {

  const steps = [
    {
      icon: FileText,
      title: "Upload Resume",
      description: "Upload your PDF resume and job description."
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Our AI analyzes skills, experience and qualifications."
    },
    {
      icon: BarChart3,
      title: "Match Score",
      description: "Get an AI-powered compatibility score."
    },
    {
      icon: Trophy,
      title: "Candidate Ranking",
      description: "Rank candidates based on job relevance."
    }
  ];


  return (
    <section className="py-24 bg-slate-50">

      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-5xl font-bold text-slate-900">
          How ResumeIQ Works
        </h2>

        <p className="mt-4 text-slate-600 text-lg">
          AI-powered resume screening in four simple steps.
        </p>


        <div className="grid md:grid-cols-4 gap-8 mt-16">

          {steps.map((step, index) => {

            const Icon = step.icon;

            return (
              <div
                key={index}
                className="
                bg-white
                rounded-2xl
                p-8
                border
                border-slate-100
                shadow-sm
                hover:shadow-xl
                hover:-translate-y-2
                hover:border-blue-200
                transition
                duration-300
                "
              >

                <div className="
                  w-14 
                  h-14 
                  mx-auto 
                  flex 
                  items-center 
                  justify-center
                  rounded-xl
                  bg-blue-100
                  text-blue-600
                ">
                  <Icon size={28}/>
                </div>


                <h3 className="mt-6 text-xl font-semibold">
                  {step.title}
                </h3>


                <p className="mt-3 text-slate-500">
                  {step.description}
                </p>


              </div>
            );

          })}

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;