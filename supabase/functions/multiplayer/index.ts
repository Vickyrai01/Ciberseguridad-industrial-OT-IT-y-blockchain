import { handleHttpRequest } from './shared/http.ts'
import { executeOperation } from './services/multiplayerService.ts'

Deno.serve((request) => handleHttpRequest(request, executeOperation))
