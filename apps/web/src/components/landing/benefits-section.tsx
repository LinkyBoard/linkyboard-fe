import { Database, Gem, Lightbulb, Rocket } from "lucide-react";

const benefits = [
  {
    icon: Rocket,
    title: "생산성 향상",
    description: "시간 절약과 효율적인 학습/작업",
  },
  {
    icon: Lightbulb,
    title: "창의적 인사이트",
    description: "새로운 아이디어와 창의적 통찰력 생성",
  },
  {
    icon: Database,
    title: "체계적 지식 축적",
    description: "체계적인 지식 축적과 관리",
  },
  {
    icon: Gem,
    title: "개인 지식 자산",
    description: "나만의 가치 있는 지식 자산 구축",
  },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="relative overflow-hidden py-20">
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold">LinkyBoard의 가치</h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            지식 관리의 새로운 패러다임을 경험하세요
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="hover:bg-accent flex items-center gap-4 rounded-lg p-4 transition-colors duration-300"
            >
              <benefit.icon className="text-primary h-6 w-6 flex-shrink-0" aria-hidden="true" />
              <div>
                <h4 className="font-semibold">{benefit.title}</h4>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-radial-gradient-purple max-size-96 absolute bottom-0 left-1/2 z-0 size-[90vw] -translate-x-1/2 translate-y-1/2 rounded-full" />
    </section>
  );
}
