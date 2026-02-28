import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const region = request.nextUrl.searchParams.get("region") || "Addis Ababa"

  const alerts = []

  if (Math.random() > 0.5) {
    alerts.push({
      id: "alert-1",
      type: "warning",
      title: "Heavy Rainfall Expected",
      description: "Expect heavy rainfall this weekend. Prepare your crops and ensure proper drainage.",
      region,
      validUntil: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    })
  }

  if (Math.random() > 0.7) {
    alerts.push({
      id: "alert-2",
      type: "danger",
      title: "Drought Warning",
      description: "Low rainfall expected for the next two weeks. Consider irrigation for sensitive crops.",
      region,
      validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    })
  }

  return NextResponse.json(alerts)
}
