interface TopicLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function TopicLayout({ children, modal }: TopicLayoutProps) {
  return (
    <>
      {children}
      {modal}
      <div id="modal-root" />
    </>
  );
}
