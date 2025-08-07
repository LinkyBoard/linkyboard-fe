import { useReplaceNavigate } from "@/hooks/use-replace-navigate";

interface ErrorPageProps {
  title: string;
  subtitle: string;
}

function ErrorPage({ title, subtitle }: ErrorPageProps) {
  const navigate = useReplaceNavigate();

  const onClick = () => {
    navigate("/bookmark");
  };

  return (
    <main className="flex h-full flex-col items-center justify-center gap-10">
      <div className="space-y-2 text-center">
        <h1 className="text-notification">{title}</h1>
        <h2 className="text-title text-gray2">{subtitle}</h2>
      </div>
      <button onClick={onClick} className="w-full flex-none">
        홈으로 돌아가기
      </button>
    </main>
  );
}

export default ErrorPage;
