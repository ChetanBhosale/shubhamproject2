import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Next.js + shadcn/ui</CardTitle>
          <CardDescription>
            Your starter is ready. Edit{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-sm">
              src/app/page.tsx
            </code>{" "}
            to get going.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Ada Lovelace" />
          </div>
          <div className="flex gap-2">
            <Button className="flex-1">Get started</Button>
            <Button variant="outline" className="flex-1">
              Docs
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
