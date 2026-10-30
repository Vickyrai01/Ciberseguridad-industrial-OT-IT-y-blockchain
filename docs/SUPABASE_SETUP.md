# Supabase para OT UNDER ATTACK

El modo individual no depende de Supabase. El modo multijugador usa una Edge Function como única entrada de negocio; React nunca consulta tablas ni recibe una service-role key.

## Configuración inicial

1. Crear un proyecto gratuito en [Supabase](https://supabase.com) y copiar `Project URL` y la `Publishable key` desde **Connect**.
2. Instalar la CLI (`brew install supabase/tap/supabase` o la guía oficial), ejecutar `supabase login` y vincular el proyecto con `supabase link --project-ref <project-ref>`.
3. Aplicar `supabase db push`.
4. Desplegar la función con `supabase functions deploy multiplayer --no-verify-jwt`.
5. Confirmar que la función tenga `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (Supabase las proporciona automáticamente; nunca copiarlas al frontend).
6. Copiar `frontend/.env.example` como `frontend/.env.local`, completar las dos variables públicas y ejecutar `npm run dev` desde la raíz.

La función usa tokens aleatorios de corta duración lógica guardados únicamente como hashes en PostgreSQL. El código de sala no es una credencial administrativa. Las respuestas se puntúan en `submit_answer_atomic`, dentro de una transacción PostgreSQL, con una restricción única por participante y escenario.

## Verificación

Crear una sala, abrir el enlace `?room=OT-XXXX`, ingresar dos nicknames e iniciar desde la ventana del presentador. Recargar un participante: su token se recupera de `localStorage` y `resumeParticipant` vuelve a consultar el servidor. Revisar en el dashboard que RLS esté habilitado y que `anon`/`authenticated` no tengan permisos directos.

El cliente se suscribe a un canal de sala solo para eventos no sensibles y vuelve a consultar por HTTP para recuperar el estado autoritativo. En el modelo sin Supabase Auth no se usa un canal privado con identidad ficticia: los tokens de participante autentican Edge Functions, no son JWT de Realtime. Si se necesita privacidad estricta de canales, habilitar Auth/JWT con claims de sala antes de cambiar el canal a `private`.

## GitHub Pages

Configurar `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` como variables de build del workflow (son públicas, pero deben corresponder al proyecto). El workflow ya calcula `VITE_BASE_PATH` desde el nombre real del repositorio. La URL de invitación se construye desde `window.location`, por lo que no hay dominio hardcodeado.

## Operación y límites

El plan gratuito debe ser suficiente para una exposición de 20–60 personas, sujeto a límites vigentes de Supabase. Las salas temporales se pueden limpiar ejecutando `select public.cleanup_expired_rooms();` desde una tarea programada de Supabase. Antes de una exposición conviene probar Wi-Fi, QR, recarga móvil y despliegue de la función.

La respuesta llega después de que el servidor valide la sala, la secuencia, la opción y el tiempo medido desde `openQuestion`. Las partidas multijugador usan el orden fijo 1→5: `current_question_index` pertenece a la sala y sólo el presentador puede avanzar. El avance se rechaza hasta que respondan todos los participantes, y los clientes reciben la nueva pregunta por Realtime y vuelven a consultar el estado autoritativo. El bundle público conserva el contenido educativo y puede revelar respuestas; la seguridad del ranking no depende de ocultarlo, porque la fuente de verdad es la función SQL. El modelo no es anti-trampa perfecto frente a control total del dispositivo.
