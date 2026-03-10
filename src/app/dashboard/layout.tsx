import Sidebar from '@/components/Sidebar';
import AuthGuard from '@/components/AuthGuard';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="flex-1 ml-[260px] p-8 transition-all duration-300">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}
