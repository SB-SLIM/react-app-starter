import React from 'react'
import { clsx } from 'clsx'

export type CardUserProps = {
  firstName: string
  lastName: string
  avatarUrl: string
  description: string
  className?: string
}

export const CardUser: React.FC<CardUserProps> = ({
  firstName,
  lastName,
  avatarUrl,
  description,
  className,
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm',
        className,
      )}
    >
      <img
        src={avatarUrl}
        alt={`${firstName} ${lastName}`}
        className="mb-3 h-20 w-20 rounded-full object-cover"
      />
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        {firstName} {lastName}
      </h3>
      <p className="m-0 text-center text-sm text-gray-600">{description}</p>
    </div>
  )
}

export default CardUser
