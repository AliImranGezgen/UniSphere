import axios from "axios"
import type { Event } from "../types/event"

// Backend API adresi
const API_URL = "http://localhost:5182/api/events"

// Backend'den tüm etkinlikleri getirir
export const getEvents = async (): Promise<Event[]> => {
  const response = await axios.get(API_URL)
  return response.data
}

// Belirli bir etkinliği siler
export const deleteEvent = async (id: number) => {
  await axios.delete(`${API_URL}/${id}`)
}