import { db } from '@/db';
import { portfolioItems } from '@/db/schema';
import { AdminUploadForm } from '@/components/admin-upload-form';
import { deletePortfolioItem } from '@/app/actions/admin';
import { desc } from 'drizzle-orm';
import Image from 'next/image';

export default async function AdminPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const items = await db.query.portfolioItems.findMany({
    orderBy: [desc(portfolioItems.createdAt)],
  });

  return (
    <main className="container mx-auto p-4 flex flex-col gap-8 max-w-4xl">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      
      <AdminUploadForm />

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold">Portfolio Items</h2>
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-card text-card-foreground items-start">
              <div className="relative w-32 h-32 shrink-0 border rounded overflow-hidden">
                <Image 
                  src={item.imageUrl} 
                  alt="Portfolio Image" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div>
                  <h3 className="font-bold">PT Description</h3>
                  <p className="text-sm">{item.descriptionPt}</p>
                </div>
                <div>
                  <h3 className="font-bold">EN Description</h3>
                  <p className="text-sm">{item.descriptionEn}</p>
                </div>
              </div>
              <form action={async () => {
                'use server';
                await deletePortfolioItem(item.id);
              }}>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:opacity-90 font-medium"
                >
                  Delete
                </button>
              </form>
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-muted-foreground italic">No items found.</p>
          )}
        </div>
      </section>
    </main>
  );
}
