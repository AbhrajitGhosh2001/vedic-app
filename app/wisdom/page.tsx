import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StarField } from '@/components/star-field'

const wisdomTopics = [
  {
    title: 'Understanding Guna Milan',
    description: 'Learn about the eight factors that determine compatibility in Vedic astrology.',
    content: 'Guna Milan is an ancient Vedic astrology technique that evaluates compatibility between two individuals based on eight key factors called Ashta Kootas. Each factor is assigned points, with a maximum score of 36.',
  },
  {
    title: 'The 27 Nakshatras',
    description: 'Discover the lunar mansions that influence your personality and destiny.',
    content: 'Nakshatras are lunar mansions in Vedic astrology, each spanning 13 degrees and 20 minutes of the zodiac. Your birth nakshatra reveals deep insights about your nature and compatibility.',
  },
  {
    title: 'Moon Sign Compatibility',
    description: 'Why your Moon sign matters more than your Sun sign in relationships.',
    content: 'In Vedic astrology, the Moon represents your emotional nature and inner self. Moon sign compatibility is crucial for understanding emotional bonds and mental harmony in relationships.',
  },
  {
    title: 'Understanding Nadi Dosha',
    description: 'Learn about this important compatibility factor and its remedies.',
    content: 'Nadi Dosha occurs when both partners share the same Nadi (energy channel). While considered challenging, various remedies and deeper chart analysis can provide solutions.',
  },
]

export default function WisdomPage() {
  return (
    <div className="relative min-h-screen">
      <StarField />
      
      <div className="container max-w-6xl mx-auto px-6 py-16 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary/80 text-sm tracking-[0.3em] uppercase font-medium">
            Ancient Knowledge
          </span>
          <h1 className="text-4xl md:text-6xl font-light mt-4 mb-6">
            Vedic <span className="text-primary font-medium">Wisdom</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the profound teachings of Vedic astrology and discover how ancient wisdom can guide modern love.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {wisdomTopics.map((topic) => (
            <Card key={topic.title} className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl font-light">{topic.title}</CardTitle>
                <CardDescription className="text-base">{topic.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{topic.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
