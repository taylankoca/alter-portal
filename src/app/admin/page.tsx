import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Search } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">Search for applicants and send messages.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card>
          <CardHeader>
            <CardTitle>Search Applicants</CardTitle>
            <CardDescription>Find applicants by name, email, or keywords.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex w-full items-center space-x-2">
              <Input type="search" placeholder="e.g., Jane Doe, marketing, React" className="flex-1" />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
            {/* Search results would be displayed here */}
            <div className="mt-4 text-center text-muted-foreground">
              <p>No results found.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Send Message</CardTitle>
            <CardDescription>Contact an applicant via email or SMS.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
              </TabsList>
              <TabsContent value="email" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email-recipient">Recipient Email</Label>
                  <Input id="email-recipient" type="email" placeholder="applicant@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-subject">Subject</Label>
                  <Input id="email-subject" placeholder="Regarding your application..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-body">Message</Label>
                  <Textarea id="email-body" placeholder="Your message here..." rows={4} />
                </div>
                <Button className="w-full">Send Email</Button>
              </TabsContent>
              <TabsContent value="sms" className="space-y-4 pt-4">
                 <div className="space-y-2">
                  <Label htmlFor="sms-recipient">Recipient Phone</Label>
                  <Input id="sms-recipient" type="tel" placeholder="+1234567890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sms-body">Message</Label>
                  <Textarea id="sms-body" placeholder="Your SMS message here..." rows={4} />
                </div>
                <Button className="w-full">Send SMS</Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
