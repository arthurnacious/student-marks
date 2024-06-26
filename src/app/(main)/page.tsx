import PageContainerWrapper from "@/components/page-container-wrapper";

export default function Home() {
  return (
    <PageContainerWrapper title="Dashboard">
      <div className="w-full h-80 border border-neutral-500/50 bg-neutral-800/20 rounded" />
      <div className="flex flex-row gap-2 mt-2 w-full">
        <div className="border-neutral-500/50 h-60 w-1/2 bg-neutral-800/20 rounded border" />
        <div className="border-neutral-500/50 h-60 w-1/2 bg-neutral-800/20 rounded border" />
      </div>
    </PageContainerWrapper>
  );
}
