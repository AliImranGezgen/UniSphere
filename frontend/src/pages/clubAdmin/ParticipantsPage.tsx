// UniSphere notu: Participants Page kulup yoneticisinin ilgili is akisini ekran seviyesinde toplar.
import NoShowRiskBadge from '../../components/ai/NoShowRiskBadge';
import type { AiRiskLevel } from '../../types/ai';
import { mockApplications, statusClass } from '../pageData';

const riskLevels: AiRiskLevel[] = ['Low', 'Medium', 'High'];

export default function ParticipantsPage() {
  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Katılımcılar</div>
          <h1 className="panel-title">Başvuru ve katılımcı listesi</h1>
          <p className="panel-subtitle">AI no-show rozeti otomatik karar değil, kulüp yöneticisi için karar destek sinyalidir.</p>
        </section>
        <div className="table-card">
          <table className="panel-table">
            <thead><tr><th>Öğrenci</th><th>Etkinlik</th><th>Durum</th><th>Check-in</th><th>AI no-show riski</th></tr></thead>
            <tbody>
              {mockApplications.map((application, index) => (
                <tr key={application.id}>
                  <td>Öğrenci #{index + 1}</td>
                  <td>{application.title}</td>
                  <td><span className={statusClass(application.status)}>{application.status}</span></td>
                  <td>{application.status === 'Katıldı' ? 'Tamamlandı' : 'Bekliyor'}</td>
                  <td><NoShowRiskBadge level={riskLevels[index % riskLevels.length]} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
