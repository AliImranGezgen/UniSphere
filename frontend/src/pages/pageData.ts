// UniSphere notu: Page Data sayfa verilerini ve gorunumunu destekleyen ortak parcadir.
import type { Event } from '../types/event';

export type MockApplication = {
  id: number;
  eventId: number;
  title: string;
  clubName: string;
  eventDate: string;
  status: 'Onaylandı' | 'Beklemede' | 'Bekleme Listesi' | 'İptal Edildi' | 'Katıldı';
};

export type MockNotification = {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

export type MockUser = {
  id: number;
  name: string;
  email: string;
  role: 'Student' | 'ClubAdmin' | 'SystemAdmin';
  status: 'Aktif' | 'İncelemede';
};

export const fallbackEvents: Event[] = [
  {
    eventId: 101,
    title: 'AI ve Gelecek Zirvesi',
    clubName: 'Teknoloji Kulübü',
    clubId: 1,
    eventDate: '2026-05-10T14:00:00',
    location: 'Ana Konferans Salonu',
    capacity: 150,
    description: 'Yapay zeka ürünleri, etik tasarım ve kampüs projeleri üzerine oturumlar.',
    posterImageUrl: null,
  },
  {
    eventId: 102,
    title: 'Kariyer Gelişimi ve Mülakat Atölyesi',
    clubName: 'Kariyer Kulübü',
    clubId: 2,
    eventDate: '2026-04-28T10:30:00',
    location: 'Seminer Salonu B',
    capacity: 80,
    description: 'CV, teknik mülakat ve vaka çalışması hazırlığı için uygulamalı oturum.',
    posterImageUrl: null,
  },
  {
    eventId: 103,
    title: 'Kampüste Akustik Gece',
    clubName: 'Müzik Kulübü',
    clubId: 3,
    eventDate: '2026-05-03T19:30:00',
    location: 'Kültür Merkezi',
    capacity: 120,
    description: 'Öğrenci gruplarından canlı performanslar ve açık sahne akışı.',
    posterImageUrl: null,
  },
];

export const mockApplications: MockApplication[] = [
  { id: 1, eventId: 101, title: 'AI ve Gelecek Zirvesi', clubName: 'Teknoloji Kulübü', eventDate: '2026-05-10T14:00:00', status: 'Onaylandı' },
  { id: 2, eventId: 102, title: 'Kariyer Gelişimi ve Mülakat Atölyesi', clubName: 'Kariyer Kulübü', eventDate: '2026-04-28T10:30:00', status: 'Beklemede' },
  { id: 3, eventId: 88, title: 'Girişimcilik Demo Günü', clubName: 'İşletme Kulübü', eventDate: '2026-03-21T13:00:00', status: 'Katıldı' },
];

export const mockNotifications: MockNotification[] = [
  { id: 1, title: 'Başvurun onaylandı', message: 'AI ve Gelecek Zirvesi için biletin hazır.', createdAt: '2026-04-14T09:10:00', read: false },
  { id: 2, title: 'Yeni etkinlik önerisi', message: 'Kariyer Kulübü atölyesi ilgi alanlarınla eşleşiyor.', createdAt: '2026-04-13T18:20:00', read: false },
  { id: 3, title: 'Yorum zamanı', message: 'Katıldığın etkinliği puanlayarak kulübe geri bildirim verebilirsin.', createdAt: '2026-04-12T12:00:00', read: true },
];

export const mockUsers: MockUser[] = [
  { id: 1, name: 'Ayşe Demir', email: 'ayse@campus.edu', role: 'Student', status: 'Aktif' },
  { id: 2, name: 'Mert Kaya', email: 'mert@campus.edu', role: 'ClubAdmin', status: 'Aktif' },
  { id: 3, name: 'Zeynep Arslan', email: 'zeynep@campus.edu', role: 'Student', status: 'İncelemede' },
];

export const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const getFillCount = (event: Event) =>
  Math.min(event.capacity, Math.max(8, Math.round(event.capacity * (0.38 + ((event.eventId % 5) * 0.09)))));

export const getFillPercent = (event: Event) => Math.round((getFillCount(event) / event.capacity) * 100);

export const statusClass = (status: string) => {
  if (['Onaylandı', 'Katıldı', 'Aktif', 'Low'].includes(status)) return 'status-pill status-pill--good';
  if (['Beklemede', 'Bekleme Listesi', 'İncelemede', 'Medium'].includes(status)) return 'status-pill status-pill--warn';
  if (['İptal Edildi', 'High'].includes(status)) return 'status-pill status-pill--danger';
  return 'status-pill';
};
