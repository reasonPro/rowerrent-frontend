import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"

const testimonials = [
  {
    name: "Marek",
    role: "Delivery Courier",
    text: "The battery life is incredible. I can do 2-3 routes a day without charging. Perfect for my delivery work!",
    rating: 5,
  },
  {
    name: "Aleksandra",
    role: "Delivery Courier",
    text: "No deposit, no hassle. Just pick up the bike and start earning. Best decision I made.",
    rating: 5,
  },
  {
    name: "Piotr",
    role: "Delivery Courier",
    text: "The service is exceptional. When I had a flat tire, they fixed it within hours. Highly recommend!",
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="w-full border-b border-border bg-background py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What couriers are saying
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col gap-4 bg-card p-6">
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-primary text-primary" />
                ))}
              </div>

              {/* Text */}
              <p className="text-sm text-card-foreground leading-relaxed">"{testimonial.text}"</p>

              {/* Author */}
              <div>
                <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                <p className="text-xs text-muted-foreground">{testimonial.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
