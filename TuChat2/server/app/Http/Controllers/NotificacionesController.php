<?php

namespace AppCrud\Http\Controllers;

use Illuminate\Http\Request;

use DB;
use AppCrud\Http\Requests;
use AppCrud\Http\Controllers\Controller;
use AppCrud\Models\Notificacion;

class NotificacionesController extends Controller
{
    public function store(Request $request)
    {
      $idFinal = $request->input('usuario_id_rey');
      $notificacion = new Notificacion();
      $notificacion->usuario_id_rey     = $idFinal;
      $notificacion->usuario_id_esclavo = $request->input('usuario_id_esclavo');
      $notificacion->estado             = $request->input('estado');
      $notificacion->save();
      return response()->json(['notificacion' => 'Creada con exito']);
    }

    public function show($id) {

			$notificaciones = DB::table('usuarios')
            ->join('contactos', 'usuarios.id', '=', 'contactos.usuario_id_esclavo')
						->join('notificacions', 'contactos.id', '=', 'notificacions.usuario_id_rey')
            ->select('notificacions.*')
						->where('usuarios.id', '=', $id)
						->where('notificacions.estado', '=', 1)
            ->get();

			return response()->json([
				'cantidadNotificaciones' => count($notificaciones),
				'notificaciones'				 => $notificaciones
			]);

		}

    public function destroy(Request $request, $usuario_id_esclavo)
    {
        $usuario_id_rey = $request->input('usuario_id_rey');

        $notificaciones = Notificacion::where('usuario_id_rey','=',$usuario_id_rey)
          ->where('usuario_id_esclavo','=',$usuario_id_esclavo)
          ->get();
        if($notificaciones->count()) {
            foreach ($notificaciones as $key => $notificacion) {
              $notificacion->delete();
            }
            return response()->json(['notificaciones' => 'Se eliminaron '.count($notificaciones).' notificaciones. ']);
        } else {
            return response()->json(['error' => 'No se pudo eliminar las notificaciones.']);
        }
    }
}
