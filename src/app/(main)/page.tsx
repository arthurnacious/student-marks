import CoursesChart from "@/components/charts/courses";
import CounterUpItems from "@/components/page-components/dashboard/counter-up-items";
import RecentClassesTable from "@/components/page-components/dashboard/recent-classes-table";
import RecentUsersTable from "@/components/page-components/dashboard/recent-users-table";
import Welcome from "@/components/page-components/dashboard/welcome";
import PageContainerWrapper from "@/components/page-container-wrapper";

export default function Home() {
  return (
    <PageContainerWrapper title="Dashboard">
      <Welcome />
      <CounterUpItems />
      <CoursesChart />
      <div className="grid grid-cols-2 gap-2 mt-2 w-full">
        <RecentClassesTable />
        <RecentUsersTable />
      </div>
    </PageContainerWrapper>
  );
}
