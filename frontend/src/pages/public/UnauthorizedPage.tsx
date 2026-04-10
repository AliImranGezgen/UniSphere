import React from 'react';
import PageHeader from '../../components/common/PageHeader';

export default function UnauthorizedPage() {
  return (
    <div>
      <PageHeader title="Yetkisiz Erişim" />
      <p>Yetkisiz erişim denemesi (403).</p>
    </div>
  );
}
