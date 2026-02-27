/**
 * API Service
 *
 * Backend ile iletişim kurmak için axios instance oluşturulur.
 *
 * baseURL:
 * Şu an local backend adresidir.
 *
 * İleride:
 * Production ortamında VPS adresi ile değiştirilecektir.
 */

import axios from "axios"

export const api = axios.create({
  baseURL: "http://localhost:5000/api"
})