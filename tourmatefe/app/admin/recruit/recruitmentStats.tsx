import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Applications } from "@/types/applications";

interface RecruitmentStatsProps {
  applications: Applications[];
}

export function RecruitmentStats({ applications }: RecruitmentStatsProps) {
  const pendingApplications = applications.filter(
    (app) => app.status === "Đang chờ duyệt"
  ).length;
  const approvedApplications = applications.filter(
    (app) => app.status === "Đã xử lí"
  ).length;
  const rejectedApplications = applications.filter(
    (app) => app.status === "Đã từ chối"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold mt-2 mb-[-2]">
            Tổng đơn ứng tuyển
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-2">{applications.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold mt-2 mb-[-2]">
            Chờ duyệt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-300 mb-2 mb-[-2]">
            {pendingApplications}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold mt-2 mb-[-2]">
            Đã duyệt
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-400 mb-2">
            {approvedApplications}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold mt-2 mb-[-2]">
            Từ chối
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-500 mb-2">
            {rejectedApplications}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
