import { redirect } from 'next/navigation'

// Logowanie hasłem współdzielonym zostało wycofane — administrator loguje się
// normalnym kontem (rola ADMIN) przez /logowanie. Ten adres zostaje tylko jako
// przekierowanie, żeby stare linki/zakładki dalej działały.
export default function AdminPage() {
  redirect('/logowanie')
}
