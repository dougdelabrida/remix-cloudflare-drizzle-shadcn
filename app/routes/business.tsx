import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  ActionFunctionArgs,
  defer,
  LoaderFunctionArgs,
} from "@remix-run/cloudflare";
import { Await, Form, useLoaderData } from "@remix-run/react";
import { business } from "db/schema";
import { Suspense } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";

export async function action({ request, context: { db } }: ActionFunctionArgs) {
  const data = await request.formData();

  const name = (data.get("name") ||
    Math.random().toString(36).slice(2)) as string;
  const registrationId = (data.get("registrationId") ||
    Math.random().toString(36).slice(2)) as string;

  console.log("inserting", name, registrationId);
  db.insert(business).values({ name, registrationId }).execute();

  return { success: true };
}

export async function loader({ context: { db } }: LoaderFunctionArgs) {
  const businesses = db.select().from(business).all();

  return defer({
    businesses,
  });
}

export default function Business() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="p-6">
      <h1 className="text-2xl">Business list</h1>
      <fieldset>
        <Form method="post" className="flex gap-3">
          <Input type="text" name="name" placeholder="Name" />
          <Button type="submit">Add</Button>
        </Form>
      </fieldset>

      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <Suspense
            fallback={
              <>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            }
          >
            <Await resolve={data.businesses}>
              {(businesses) => (
                <>
                  {businesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium">
                        {business.registrationId}
                      </TableCell>
                      <TableCell>{business.name}</TableCell>
                    </TableRow>
                  ))}
                </>
              )}
            </Await>
          </Suspense>
        </TableBody>
      </Table>
    </div>
  );
}
