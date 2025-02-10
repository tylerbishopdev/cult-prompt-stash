import { clsx, type ClassValue } from "clsx"
import { customAlphabet } from "nanoid"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7
) // 7-character random string

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const json = await res.json()
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number
      }
      error.status = res.status
      throw error
    } else {
      throw new Error("An unexpected error occurred")
    }
  }

  return res.json()
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)

// TODO is being used?
export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>
) => {
  fn()
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

type TimeUnit = "second" | "minute" | "hour" | "day" | "month" | "year"

/**
 * Formats a given date string to a relative time string (e.g., "Updated 6 months ago").
 *
 * @param {string} dateString - The date string in ISO 8601 format.
 * @returns {string} - A relative time string representing how long ago the date was.
 */
export function formatRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)

  // Calculate difference in milliseconds
  const diffInMs = now.getTime() - date.getTime()

  // Convert difference to different time units
  const diffInSeconds = Math.round(diffInMs / 1000)
  const diffInMinutes = Math.round(diffInSeconds / 60)
  const diffInHours = Math.round(diffInMinutes / 60)
  const diffInDays = Math.round(diffInHours / 24)
  const diffInMonths = Math.round(diffInDays / 30) // Approximation
  const diffInYears = Math.round(diffInDays / 365) // Approximation

  // Create a RelativeTimeFormat instance with desired options
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

  // Helper function to format and return the relative time string
  function format(unitValue: number, unit: TimeUnit): string {
    return rtf.format(-unitValue, unit)
  }

  // Determine the most appropriate unit and format accordingly
  if (Math.abs(diffInYears) > 0) {
    return format(diffInYears, "year")
  } else if (Math.abs(diffInMonths) > 0) {
    return format(diffInMonths, "month")
  } else if (Math.abs(diffInDays) > 0) {
    return format(diffInDays, "day")
  } else if (Math.abs(diffInHours) > 0) {
    return format(diffInHours, "hour")
  } else if (Math.abs(diffInMinutes) > 0) {
    return format(diffInMinutes, "minute")
  } else {
    return format(diffInSeconds, "second")
  }
}

// Utility functions for encoding and decoding
export const xorEncrypt = (str: string, key: string) => {
  let result = ""
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(
      str.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    )
  }
  return btoa(result)
}

export const xorDecrypt = (str: string, key: string) => {
  str = atob(str)
  let result = ""
  for (let i = 0; i < str.length; i++) {
    result += String.fromCharCode(
      str.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    )
  }
  return result
}

// Secret key for encoding and decoding
export const secretKey = "your_secret_key_here_asdflasdfasldfalsdfah_"

export function debounce(func, delay) {
  let timeoutId
  return function (...args) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
