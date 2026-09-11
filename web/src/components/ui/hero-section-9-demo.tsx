import HeroSection from '@/components/ui/hero-section-9';
import { Users, Briefcase, Link as LinkIcon } from 'lucide-react';

const HeroSectionDemo = () => {
  // Sample data to be passed as props
  const heroData = {
    title: (
      <>
        A new way to learn <br /> & get knowledge
      </>
    ),
    subtitle: 'EduFlex is here for you with various courses & materials from skilled tutors all around the world.',
    actions: [
      {
        text: 'Join the Class',
        onClick: () => alert('Join the Class clicked!'),
        variant: 'default' as const,
      },
      {
        text: 'Learn more',
        onClick: () => alert('Learn More clicked!'),
        variant: 'outline' as const,
      },
    ],
    stats: [
      {
        value: '15,2K',
        label: 'Active students',
        icon: <Users className="h-5 w-5 text-muted-foreground" />,
      },
      {
        value: '4,5K',
        label: 'Tutors',
        icon: <Briefcase className="h-5 w-5 text-muted-foreground" />,
      },
      {
        value: 'Resources',
        label: '',
        icon: <LinkIcon className="h-5 w-5 text-muted-foreground" />,
      },
    ],
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    ],
  };

  return (
    <div className="w-full bg-background">
      <HeroSection
        title={heroData.title}
        subtitle={heroData.subtitle}
        actions={heroData.actions}
        stats={heroData.stats}
        images={heroData.images}
      />
    </div>
  );
};

export default HeroSectionDemo;
