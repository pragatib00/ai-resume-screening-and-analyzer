import {
  Sparkles,
  Target,
  FileSearch,
  Users
} from "lucide-react";


function Features() {

  const features = [
    {
      icon: Sparkles,
      title: "AI Resume Analysis",
      description:
        "Analyze resumes using AI to extract skills, experience and qualifications."
    },
    {
      icon: Target,
      title: "Smart Matching",
      description:
        "Compare candidate profiles with job requirements and generate match scores."
    },
    {
      icon: FileSearch,
      title: "ATS Score Evaluation",
      description:
        "Evaluate resumes using ATS-friendly scoring and improvement suggestions."
    },
    {
      icon: Users,
      title: "Candidate Ranking",
      description:
        "Help recruiters identify the best candidates quickly."
    }
  ];


  return (
    <section className="py-24 bg-white">

      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center">

          <h2 className="text-5xl font-bold text-slate-900">
            Powerful AI Features
          </h2>

          <p className="mt-4 text-lg text-slate-500">
            Everything you need for intelligent recruitment.
          </p>

        </div>


        <div className="grid md:grid-cols-4 gap-8 mt-16">

          {features.map((feature,index)=>{

            const Icon = feature.icon;

            return (

              <div
                key={index}
                className="
                rounded-2xl
                border
                border-slate-200
                p-8
                hover:-translate-y-2
                hover:border-blue-200
                transition
                duration-300
                hover:shadow-xl
                "
              >

                <div
                  className="
                  w-14
                  h-14
                  flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-100
                  text-blue-600
                  "
                >
                  <Icon size={28}/>
                </div>


                <h3 className="mt-6 text-xl font-semibold">
                  {feature.title}
                </h3>


                <p className="mt-3 text-slate-500">
                  {feature.description}
                </p>


              </div>

            );

          })}


        </div>

      </div>

    </section>
  );
}


export default Features;