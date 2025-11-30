import { Lock, Zap, Battery, Wrench } from "lucide-react"
import { Card } from "@/components/ui/card"

const benefits = [
  {
    icon: Lock,
    title: "Easy Start",
    description: "No deposit required. Just sign up and start riding.",
  },
  {
    icon: Zap,
    title: "Save Money",
    description: "No fuel costs. Electric power means maximum savings.",
  },
  {
    icon: Battery,
    title: "Long Range Battery",
    description: "6-12 hours of battery life per charge. All day coverage.",
  },
  {
    icon: Wrench,
    title: "Free Maintenance",
    description: "We fix flat tires and handle all maintenance for you.",
  },
]

export default function BenefitsGrid() {
  return (
    <section className="w-full border-b border-border bg-background py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Why choose GreenMo?
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <Card key={index} className="flex flex-col gap-4 bg-card p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon size={24} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
