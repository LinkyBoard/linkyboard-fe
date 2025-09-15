import AiInsight from "@/components/(with-side-bar)/dashboard/ai-insight";
import DashboardHeader from "@/components/(with-side-bar)/dashboard/dashboard-header";
import MyActivity from "@/components/(with-side-bar)/dashboard/my-activity";

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "좋은 아침입니다! 👋";
  }
  if (hour >= 12 && hour < 17) {
    return "좋은 오후입니다! 🌞";
  }
  if (hour >= 17 && hour < 22) {
    return "좋은 저녁입니다! 🌆";
  }
  return "좋은 밤입니다! 🌙";
}

export default function DashboardPage() {
  return (
    <div>
      <DashboardHeader />

      <section className="mb-8">
        <h1 className="mb-2 text-4xl font-bold">{getGreeting()}</h1>
        <p className="text-muted-foreground text-lg">오늘 콘텐츠 관리 현황을 확인해보세요</p>
      </section>

      <AiInsight />

      <MyActivity />
    </div>
  );
}
