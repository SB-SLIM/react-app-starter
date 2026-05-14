
import React from 'react';

export type CardUserProps = {
  firstName: string;
  lastName: string;
  avatarUrl: string;
  description: string;
};

export const CardUser: React.FC<CardUserProps> = ({
  firstName,
  lastName,
  avatarUrl,
  description,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        border: '1px solid #ddd',
        borderRadius: '8px',
      }}
    >
      <img
        src={avatarUrl}
        alt={`${firstName} ${lastName}`}
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginBottom: '12px',
        }}
      />
      <h3 style={{ margin: '0 0 8px 0' }}>
        {firstName} {lastName}
      </h3>
      <p style={{ margin: 0, textAlign: 'center', color: '#555' }}>
        {description}
      </p>
    </div>
  );
};

export default CardUser;
