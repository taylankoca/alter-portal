
"use client";

import { useLanguage } from '@/context/language-context';
import ProjectCard from '@/components/project-card';
import { placeholderImages } from '@/lib/placeholder-images.json';

// Mock project data
const projects = [
  {
    id: '1',
    title: 'İstanbul Finans Merkezi - Kule 1',
    description: 'Ana taşıyıcı sistem ve cephe mühendisliği hizmetleri.',
    members: ['Ahmet Yılmaz', 'Ayşe Kaya'],
    image: placeholderImages.project1,
  },
  {
    id: '2',
    title: 'Çanakkale 1915 Köprüsü Yaklaşım Viyadükleri',
    description: 'Asma köprüye bağlanan viyadüklerin segmental imalatı.',
    members: ['Ayşe Kaya', 'Fatma Demir', 'Mehmet Çelik'],
    image: placeholderImages.project2,
  },
  {
    id: '3',
    title: 'İzmir Konak Karma Yaşam Projesi',
    description: 'Konut, ofis ve AVM içeren kompleksin statik projelendirmesi.',
    members: ['Fatma Demir'],
    image: placeholderImages.project3,
  },
    {
    id: '4',
    title: 'Artvin Yusufeli Barajı ve HES',
    description: 'Gövde beton dökümü ve zemin iyileştirme çalışmaları.',
    members: ['Mehmet Çelik', 'Zeynep Arslan', 'Mustafa Öztürk'],
    image: placeholderImages.project4,
  },
    {
    id: '5',
    title: 'Ankara-Sivas Yüksek Hızlı Tren Hattı',
    description: 'Güzergah üzerindeki sanat yapılarının ve tünellerin inşası.',
    members: ['Zeynep Arslan', 'Ahmet Yılmaz'],
    image: placeholderImages.project5,
  },
    {
    id: '6',
    title: 'Rize-Artvin Havalimanı Üstyapı Tesisleri',
    description: 'Deniz dolgusu üzerine inşa edilen terminal ve pist projeleri.',
    members: ['Mustafa Öztürk', 'Ayşe Kaya'],
    image: placeholderImages.project6,
  },
];


export default function ProjectsPage() {
  const { translations } = useLanguage();
  const t = translations.navigation;
  const projectT = translations.projects_page;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">{t.projects}</h1>
        <p className="text-muted-foreground">{projectT.description}</p>
      </header>
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
