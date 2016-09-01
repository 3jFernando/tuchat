<?php

namespace AppCrud\Http\Controllers;

use Illuminate\Http\Request;

use AppCrud\Http\Requests;
use AppCrud\Http\Controllers\Controller;

use AppCrud\Models\Usuario;
use AppCrud\Models\Contacto;

use DB;

class UsuariosController extends Controller
{

    //metodo de listar usuarios
    public function index(Request $request)
    {
      $id = $request->input('id');
    	$usuarios = Usuario::where('id','!=',$id)->get();
    	return $usuarios;
    }

    //inicio de sesion para los usuarios registrados
    public function login(Request $request)
    {
        $nombre_usuario = $request->input('nombre_usuario');
        $clave          = $request->input('clave');
        $usuario = Usuario::where('nombre_usuario', '=', $nombre_usuario)
          ->where('clave', '=', $clave)
          ->get();
        if($usuario->count()) {
          return response()->json(['usuario' => $usuario]);
        } else {
          return response()->json(['usuarioError' => 'Error al iniciar sesion']);
        }
    }

    //agregar contactos para los usuarios registrados
    public function agregarContactos(Request $request)
    {
      $validar = Contacto::where('usuario_id_rey','=',$request->input('usuario_id_rey'))
          ->where('usuario_id_esclavo','=',$request->input('usuario_id_esclavo'))
          ->get();
      if($validar->count()) {
          return response()->json(['error'=>'Ya estas unido a este usuario']);
      } else {
        $ping = str_random(50);

        $contacto = new Contacto();
        $contacto->usuario_id_rey     = $request->input('usuario_id_rey');
        $contacto->usuario_id_esclavo = $request->input('usuario_id_esclavo');
        $contacto->corazon            = 0;
        $contacto->ping               = $ping;
        $contacto->save();

        $contacto = new Contacto();
        $contacto->usuario_id_rey     = $request->input('usuario_id_esclavo');
        $contacto->usuario_id_esclavo = $request->input('usuario_id_rey');
        $contacto->corazon            = 0;
        $contacto->ping               = $ping;
        $contacto->save();
      }
    }

    //listado de contactos por Usuarios
    public function listadecontactos(Request $request)
    {
      $contactos = DB::table('usuarios')
          ->join('contactos', 'usuarios.id', '=', 'contactos.usuario_id_esclavo')
          ->select('usuarios.*', 'contactos.id', 'contactos.usuario_id_rey', 'contactos.usuario_id_esclavo', 'contactos.ping', 'contactos.amigo')
          ->where('contactos.usuario_id_rey', '=', $request->input('usuario_id_rey'))
          ->get();
      if($contactos) {
          return response()->json(['sihaycontactos' => $contactos]);
      } else {
          return response()->json(['nohaycontactos' => "no hay contactos para mostrar"]);
      }
    }

    //dar megustas y actualizar el estado del mismo (1,0)
    public function update(Request $request, $id)
    {
      $ping           = $request->input('ping');
      $usuario_id_rey = $request->input('usuario_id_rey');
      $contacto = Contacto::where('ping', '=', $ping)
          ->where('usuario_id_rey', '=', $usuario_id_rey)
          ->get();
      if($contacto->count()) {
        $contacto = $contacto->first();
        if($contacto->corazon == 1) {
          $contacto->corazon = 0;
          $contacto->save();
          return response()->json(["corazon" => "corazon actualizado"]);
        }
        else if($contacto->corazon == 0) {
          $contacto->corazon = 1;
          $contacto->save();
          return response()->json(["corazon" => "corazon actualizado"]);
        }
      } else {
        return response()->json(["error" => "los datos no coinciden"]);
      }
    }

    //actualizar datos de los usuarios
    public function actualizardatos(Request $request)
    {
      $usuario = Usuario::find($request->input('id'));
      if($usuario) {
        $usuario->nombre          = $request->input('nombre');
        $usuario->nombre_usuario  = $request->input('nombre_usuario');
        $usuario->telefono        = $request->input('telefono');
        $usuario->direccion       = $request->input('direccion');
        $usuario->estado          = $request->input('estado');
        $usuario->correo          = $request->input('correo');
        $usuario->save();
        return response()->json(['usuario' => $usuario]);
      } else {
        return response()->json(['error' => 'no existe el usuario con ese id']);
      }
    }

    public function actualizarentuchat(Request $request)
    {
      $usuario = Usuario::find($request->input('id'));
      if($usuario) {
        $usuario->entuchat = $request->input('entuchat');
        $usuario->save();
        return response()->json(['usuario' => 'conectado']);
      } else {
        return response()->json(['error' => 'no existe el usuario con ese id']);
      }
    }

}
