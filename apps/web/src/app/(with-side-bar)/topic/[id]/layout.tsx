interface TopicStickerDetailLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function TopicStickerDetailLayout({
  children,
  modal,
}: TopicStickerDetailLayoutProps) {
  return (
    <>
      {children}
      {modal}
      <div id="modal-root" />
    </>
  );
}
