import ClassesContainer from "@/components/charts/classes-container";
import CoursesChart from "@/components/charts/courses";
import UserRelatedClasses from "@/components/charts/user-related-classes";
import ChooseOverviewYear from "@/components/page-components/dashboard/choose-overview-year";
import CounterUpItems from "@/components/page-components/dashboard/counter-up-items";
import RecentClassesTable from "@/components/page-components/dashboard/recent-classes-table";
import RecentUsersTable from "@/components/page-components/dashboard/recent-users-table";
import Welcome from "@/components/page-components/dashboard/welcome";
import PageContainerWrapper from "@/components/page-container-wrapper";
import { auth } from "@/lib/auth";

type Props = {};

const Dashboard: Props = async ({}) => {
  const session = await auth();
  const isAdmin = session?.user?.role === "Admin";

  return (
    <PageContainerWrapper title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-2 w-full">
        <Welcome />
        {isAdmin && <ChooseOverviewYear />}
      </div>
      {isAdmin && (
        <>
          <CounterUpItems />
          <CoursesChart />
        </>
      )}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full mt-2">
          <RecentClassesTable />
          <RecentUsersTable />
        </div>
      )}
      <div className="grid grid-cols-1 gap-2 w-full mt-2">
        <UserRelatedClasses />
      </div>
      <ClassesContainer userId={session?.user?.id!!} />
    </PageContainerWrapper>
  );
};

export default Dashboard;
