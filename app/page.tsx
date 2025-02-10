import { DesktopLayout } from "./desktop-layout"
import { MobileLayout } from "./mobile-layout"

export default async function IndexPage() {
  return (
    <div className="h-screen ">
      <div className="hidden md:block">
        <DesktopLayout defaultCollapsed={undefined} navCollapsedSize={4} />
      </div>

      <div className="md:hidden">
        <MobileLayout />
      </div>
    </div>
  )
}
