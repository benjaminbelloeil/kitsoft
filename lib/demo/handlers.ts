/* eslint-disable @typescript-eslint/no-explicit-any */
import { dbNoteToNote, type NoteDB } from '@/interfaces/note';
import { DEMO_USER_ID, type DemoRole } from '@/lib/demo/config';
import { DEMO_ROLE_REQUIREMENTS } from '@/lib/demo/data/projects';
import { getStore, nextId } from '@/lib/demo/store';

export interface DemoRequestContext {
  method: string;
  /** Path with the leading `/api` removed, e.g. `/user/level/get-level`. */
  path: string;
  searchParams: URLSearchParams;
  body: any;
  role: DemoRole;
}

export interface DemoResponse {
  status: number;
  body: unknown;
}

const ok = (body: unknown): DemoResponse => ({ status: 200, body });
const created = (body: unknown): DemoResponse => ({ status: 201, body });
const success = (extra: Record<string, unknown> = {}): DemoResponse => ok({ success: true, ...extra });

const LEVEL_BY_KEY: Record<string, { id_nivel: string; numero: number; titulo: string }> = {
  admin: { id_nivel: 'demo-nivel-admin', numero: 1, titulo: 'Administrador' },
  'people-lead': { id_nivel: 'demo-nivel-people-lead', numero: 2, titulo: 'People Lead' },
  'project-lead': { id_nivel: 'demo-nivel-project-lead', numero: 3, titulo: 'Project Lead' },
  'project-manager': { id_nivel: 'demo-nivel-project-manager', numero: 4, titulo: 'Project Manager' },
  empleado: { id_nivel: 'demo-nivel-empleado', numero: 5, titulo: 'Empleado' },
};

function person(id: string) {
  return getStore().people.find((p) => p.id_usuario === id);
}

function userRow(id: string) {
  const p = person(id);
  if (!p) return null;
  return {
    id_usuario: p.id_usuario,
    nombre: p.nombre,
    apellido: p.apellido,
    titulo: p.titulo,
    bio: p.bio,
    url_avatar: p.url_avatar,
    url_curriculum: p.url_curriculum,
    fecha_inicio_empleo: p.fecha_inicio_empleo,
    id_peoplelead: p.id_peoplelead,
    correo: p.email,
  };
}

function profileRow(id: string) {
  const p = person(id);
  if (!p) return null;
  return {
    id_usuario: p.id_usuario,
    ID_Usuario: p.id_usuario,
    Nombre: p.nombre,
    Apellido: p.apellido,
    Titulo: p.titulo,
    Bio: p.bio,
    URL_Avatar: p.url_avatar,
    URL_Curriculum: p.url_curriculum,
    Fecha_Inicio_Empleo: p.fecha_inicio_empleo,
    ID_PeopleLead: p.id_peoplelead,
    direccion: {
      ID_Direccion: `demo-dir-${p.id_usuario}`,
      Pais: 'MX',
      Estado: 'Nuevo León',
      Ciudad: 'Monterrey',
      ID_Usuario: p.id_usuario,
      Tipo: 'Casa',
    },
    telefono: {
      ID_Telefono: `demo-tel-${p.id_usuario}`,
      Codigo_Pais: '+52',
      Codigo_Estado: '81',
      Numero: '5512 3456',
      ID_Usuario: p.id_usuario,
      Tipo: 'Celular',
    },
    correo: {
      ID_Correo: `demo-mail-${p.id_usuario}`,
      Correo: p.email,
      ID_Usuario: p.id_usuario,
      Tipo: 'Trabajo',
    },
  };
}

function adminUserRow(id: string) {
  const p = person(id);
  if (!p) return null;
  const level = LEVEL_BY_KEY[p.nivel] ?? LEVEL_BY_KEY.empleado;
  return {
    id_usuario: p.id_usuario,
    nombre: p.nombre,
    apellido: p.apellido,
    titulo: p.titulo,
    email: p.email,
    url_avatar: p.url_avatar,
    registered: true,
    hasLoggedIn: true,
    lastLogin: p.ultimo_acceso,
    ID_PeopleLead: p.id_peoplelead,
    id_peoplelead: p.id_peoplelead,
    activo: p.activo,
    role: level,
  };
}

function teamFor(projectId: string) {
  const store = getStore();
  return store.assignments
    .filter((a) => a.id_proyecto === projectId)
    .map((a) => {
      const u = person(a.id_usuario);
      const role = store.roles.find((r) => r.id_rol === a.id_rol);
      return {
        id_usuario_proyecto: a.id_usuario_proyecto,
        id_usuario: a.id_usuario,
        id_proyecto: a.id_proyecto,
        id_rol: a.id_rol,
        horas: a.horas,
        nombre: u?.nombre ?? '',
        apellido: u?.apellido ?? '',
        email: u?.email ?? '',
        url_avatar: u?.url_avatar ?? null,
        activo: u?.activo ?? true,
        rol_nombre: role?.nombre ?? '',
      };
    });
}

function projectPayload(projectId: string, viewerId?: string) {
  const store = getStore();
  const p = store.projects.find((x) => x.id_proyecto === projectId);
  if (!p) return null;
  const cliente = store.clients.find((c) => c.id_cliente === p.id_cliente);
  const lead = person(p.id_projectlead);
  const mine = viewerId
    ? store.assignments.find((a) => a.id_proyecto === projectId && a.id_usuario === viewerId)
    : undefined;
  const myRole = mine ? store.roles.find((r) => r.id_rol === mine.id_rol) : undefined;
  const team = teamFor(p.id_proyecto);

  return {
    id_proyecto: p.id_proyecto,
    titulo: p.titulo,
    descripcion: p.descripcion,
    id_cliente: p.id_cliente,
    id_projectlead: p.id_projectlead,
    fecha_inicio: p.fecha_inicio,
    fecha_fin: p.fecha_fin,
    activo: p.activo,
    horas_totales: p.horas_totales,
    color: p.color,
    cliente: cliente?.nombre ?? 'Cliente Desconocido',
    clientData: cliente ?? null,
    project_lead: lead
      ? {
          id_usuario: lead.id_usuario,
          nombre: lead.nombre,
          apellido: lead.apellido,
          titulo: lead.titulo,
          url_avatar: lead.url_avatar,
        }
      : null,
    user_role: myRole?.nombre,
    user_hours: mine?.horas ?? 0,
    assignedUsers: team,
    usuarios: team,
    roles: store.roles,
  };
}

function userProjects(userId: string, activo: boolean) {
  const store = getStore();
  const ids = Array.from(
    new Set(store.assignments.filter((a) => a.id_usuario === userId).map((a) => a.id_proyecto))
  );
  return ids
    .map((id) => projectPayload(id, userId))
    .filter((p): p is NonNullable<typeof p> => !!p && p.activo === activo);
}

function skillsFor(userId: string) {
  const store = getStore();
  return store.userSkills
    .filter((s) => s.id_usuario === userId)
    .map((s) => {
      const skill = store.skills.find((x) => x.id_habilidad === s.id_habilidad);
      return {
        id_habilidad: s.id_habilidad,
        id_usuario: s.id_usuario,
        nivel_experiencia: s.nivel_experiencia,
        titulo: skill?.nombre ?? 'Habilidad',
        nombre: skill?.nombre ?? 'Habilidad',
        categoria: skill?.categoria ?? 'General',
      };
    });
}

function certificatesFor(userId: string) {
  const store = getStore();
  return store.userCertificates
    .filter((c) => c.id_usuario === userId)
    .map((c) => {
      const cat = store.certificateCatalog.find((x) => x.id_certificado === c.id_certificado);
      return {
        id_usuario_certificado: c.id_usuario_certificado,
        id_certificado: c.id_certificado,
        id_usuario: c.id_usuario,
        url_archivo: c.url_archivo,
        fecha_inicio: c.fecha_inicio,
        fecha_fin: c.fecha_fin,
        certificados: cat ?? null,
      };
    });
}

function experienceFor(userId: string) {
  const store = getStore();
  return store.experience
    .filter((e) => e.id_usuario === userId)
    .map((e) => ({
      ID_Experiencia: e.id_experiencia,
      id_experiencia: e.id_experiencia,
      ID_Usuario: e.id_usuario,
      Empresa: e.empresa,
      Titulo: e.titulo,
      Descripcion: e.descripcion,
      Fecha_Inicio: e.fecha_inicio,
      Fecha_Fin: e.fecha_fin,
      Ubicacion: e.ubicacion,
      Actual: e.actual,
      habilidades: [],
      skills: [],
    }));
}

function enhancedFeedback(userId: string) {
  const store = getStore();
  return store.feedback
    .filter((f) => f.id_usuario === userId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .map((f) => {
      const author = person(f.id_autor);
      const project = store.projects.find((p) => p.id_proyecto === f.id_proyecto);
      return {
        id: f.id_retroalimentacion,
        from: {
          id: author?.id_usuario ?? '',
          name: author ? `${author.nombre} ${author.apellido}` : 'Usuario Anónimo',
          avatar: author?.url_avatar ?? '/placeholder-avatar.png',
          role: author?.titulo ?? 'Sin título',
        },
        date: f.fecha,
        rating: f.valoracion,
        category: f.categoria,
        message: f.mensaje,
        project: project?.titulo,
      };
    });
}

function feedbackStats(userId: string) {
  const store = getStore();
  const rows = store.feedback.filter((f) => f.id_usuario === userId);
  const byCategory = new Map<string, number[]>();
  for (const row of rows) {
    const list = byCategory.get(row.categoria) ?? [];
    list.push(row.valoracion);
    byCategory.set(row.categoria, list);
  }
  const colors = ['blue', 'indigo', 'cyan', 'emerald'];
  return Array.from(byCategory.entries()).map(([title, values], index) => {
    const average = values.reduce((sum, v) => sum + v, 0) / values.length;
    const delta = values.length >= 2 ? values[0] - values[values.length - 1] : 0;
    return {
      title,
      value: average.toFixed(1),
      trend: `${delta >= 0 ? '+' : ''}${delta.toFixed(1)}`,
      color: colors[index % colors.length],
    };
  });
}

function trajectoryPaths(userId: string) {
  const store = getStore();
  const nameOf = (id: string) => store.certificateCatalog.find((x) => x.id_certificado === id);
  return store.paths
    .filter((p) => p.id_usuario === userId)
    .map((path, index) => ({
      id: index + 1,
      id_path: path.id_path,
      title: path.meta,
      description: path.descripcion,
      completed: path.completado,
      fecha_inicio: path.fecha_inicio,
      levels: path.niveles.map((nivel) => ({
        id: nivel.id_nivel,
        name: `Nivel ${nivel.numero}`,
        completed: nivel.status === 'completado',
        current: nivel.status === 'en_progreso',
        certificates: nivel.certificados.map((c) => ({
          id: c.id_certificado,
          name: nameOf(c.id_certificado)?.curso,
          description: nameOf(c.id_certificado)?.descripcion,
          completed: c.completado,
        })),
      })),
      allCertificates: path.niveles.flatMap((nivel) =>
        nivel.certificados.map((c) => ({
          id: c.id_certificado,
          name: nameOf(c.id_certificado)?.curso,
          description: nameOf(c.id_certificado)?.descripcion,
          completed: c.completado,
          level: nivel.numero,
        }))
      ),
    }));
}

export function handleDemoRequest(ctx: DemoRequestContext): DemoResponse {
  const { method, path, searchParams, body, role } = ctx;
  const store = getStore();
  const targetId = searchParams.get('userId') || DEMO_USER_ID;

  // ---- identity & level -------------------------------------------------
  if (path === '/user/level/get-level') {
    return ok({
      id_nivel: role.id_nivel,
      numero: role.numero,
      titulo: role.titulo,
      descripcion: role.descripcion,
    });
  }
  if (path === '/user/level/is-admin') return ok({ isAdmin: role.numero === 1 });
  if (path === '/user/level/is-people-lead') return ok({ isPeopleLead: role.numero === 2 });
  if (path === '/user/level/is-project-lead') return ok({ isProjectLead: role.numero === 3 });
  if (path === '/user/level/is-project-manager') return ok({ isProjectManager: role.numero === 4 });
  if (path === '/user/level/ensure') return ok({ levelNumber: role.numero });
  if (path === '/user/ensure') return ok(true);
  if (path === '/user/sync-auth') return success();
  if (path === '/user/email') return ok({ email: person(DEMO_USER_ID)?.email ?? null });
  if (path === '/admin/auth/check') return ok({ isAdmin: role.numero === 1 });

  // ---- profile ----------------------------------------------------------
  if (path === '/user/profile' && method === 'GET') return ok(userRow(targetId));
  if (path === '/profile/get') return ok(profileRow(targetId));
  if (path === '/user/profile/update' || path === '/profile/save') {
    const p = person(body?.ID_Usuario ?? body?.id_usuario ?? DEMO_USER_ID);
    if (p) {
      if (body?.Nombre !== undefined) p.nombre = body.Nombre;
      if (body?.Apellido !== undefined) p.apellido = body.Apellido;
      if (body?.Titulo !== undefined) p.titulo = body.Titulo;
      if (body?.Bio !== undefined) p.bio = body.Bio;
    }
    return success();
  }
  if (path === '/user/all') return ok(store.people.map((p) => userRow(p.id_usuario)));

  // ---- avatar / curriculum ---------------------------------------------
  if (path === '/avatar/get') return ok({ url: person(targetId)?.url_avatar ?? null });
  if (path === '/avatar/upload' || path === '/avatar/update') {
    return ok({ success: true, url: person(DEMO_USER_ID)?.url_avatar ?? null });
  }
  if (path === '/avatar/delete') return success();
  if (path === '/curriculum/get' || path === '/people-lead/curriculum') {
    return ok({ url: person(targetId)?.url_curriculum ?? null });
  }
  if (path === '/curriculum/upload' || path === '/curriculum/update') {
    return ok({ success: true, url: person(DEMO_USER_ID)?.url_curriculum ?? null });
  }
  if (path === '/curriculum/delete') return success();

  // ---- skills -----------------------------------------------------------
  if (path === '/skills/user' || path === '/people-lead/skills') return ok(skillsFor(targetId));
  if (path === '/skills/get') return ok({ skills: skillsFor(targetId) });
  if (path === '/skills/all') return ok(store.skills.map((s) => ({ ...s, titulo: s.nombre })));
  if (path === '/skills/search') {
    const q = (searchParams.get('query') || '').toLowerCase();
    return ok(
      store.skills
        .filter((s) => s.nombre.toLowerCase().includes(q))
        .map((s) => ({ ...s, titulo: s.nombre }))
    );
  }
  if (path === '/skills/experience') return ok([]);
  if (path === '/skills/add') {
    const id = body?.skillId ?? body?.id_habilidad;
    const exists = store.userSkills.some((s) => s.id_usuario === DEMO_USER_ID && s.id_habilidad === id);
    if (id && !exists) {
      store.userSkills.push({
        id_usuario: DEMO_USER_ID,
        id_habilidad: id,
        nivel_experiencia: body?.nivel_experiencia ?? body?.nivel ?? 1,
      });
      return ok({ success: true, added: true, skillId: id });
    }
    return ok({ success: true, updated: true, skillId: id });
  }
  if (path === '/skills/remove') {
    const id = body?.skillId ?? body?.id_habilidad;
    store.userSkills = store.userSkills.filter(
      (s) => !(s.id_usuario === DEMO_USER_ID && s.id_habilidad === id)
    );
    return success();
  }
  if (path === '/skills/update' || path === '/skills/update-level') {
    const id = body?.skillId ?? body?.id_habilidad;
    const row = store.userSkills.find((s) => s.id_usuario === DEMO_USER_ID && s.id_habilidad === id);
    if (row && body?.nivel_experiencia !== undefined) row.nivel_experiencia = body.nivel_experiencia;
    return success();
  }

  // ---- certificates -----------------------------------------------------
  if (path === '/certificate/types') return ok(store.certificateCatalog);
  if (path === '/certificate/user' || path === '/people-lead/certificates') {
    return ok(certificatesFor(targetId));
  }
  if (path === '/certificate/add') {
    const id = body?.id_certificado ?? store.certificateCatalog[0].id_certificado;
    store.userCertificates.push({
      id_usuario_certificado: nextId('demo-uc'),
      id_usuario: DEMO_USER_ID,
      id_certificado: id,
      url_archivo: body?.url_archivo ?? null,
      fecha_inicio: body?.fecha_inicio ?? '2026-09-25',
      fecha_fin: body?.fecha_fin ?? null,
    });
    return success();
  }
  if (path === '/certificate/delete') {
    const id = body?.id_usuario_certificado ?? body?.id_certificado;
    store.userCertificates = store.userCertificates.filter(
      (c) => c.id_usuario_certificado !== id && c.id_certificado !== id
    );
    return success();
  }
  if (path === '/certificate/name') {
    const id = searchParams.get('id');
    const cat = store.certificateCatalog.find((x) => x.id_certificado === id);
    return ok({ name: cat?.curso ?? 'Certificado' });
  }
  if (path === '/certificate/update') return success();
  if (path === '/certificate/upload') return ok({ success: true, url: '/demo/certificados/demo.pdf' });

  // ---- experience -------------------------------------------------------
  if (path === '/experience/user' || path === '/people-lead/experience') {
    return ok(experienceFor(targetId));
  }
  if (path === '/experience/create') {
    const id = nextId('demo-exp');
    store.experience.push({
      id_experiencia: id,
      id_usuario: DEMO_USER_ID,
      empresa: body?.Empresa ?? 'Empresa',
      titulo: body?.Titulo ?? 'Puesto',
      descripcion: body?.Descripcion ?? '',
      fecha_inicio: body?.Fecha_Inicio ?? '2026-01-01',
      fecha_fin: body?.Fecha_Fin ?? null,
      ubicacion: body?.Ubicacion ?? '',
      actual: Boolean(body?.Actual),
    });
    return ok({ success: true, ID_Experiencia: id });
  }
  if (path === '/experience/update') {
    const row = store.experience.find(
      (e) => e.id_experiencia === (body?.ID_Experiencia ?? body?.id_experiencia)
    );
    if (row) {
      if (body?.Empresa !== undefined) row.empresa = body.Empresa;
      if (body?.Titulo !== undefined) row.titulo = body.Titulo;
      if (body?.Descripcion !== undefined) row.descripcion = body.Descripcion;
      if (body?.Fecha_Inicio !== undefined) row.fecha_inicio = body.Fecha_Inicio;
      if (body?.Fecha_Fin !== undefined) row.fecha_fin = body.Fecha_Fin;
      if (body?.Ubicacion !== undefined) row.ubicacion = body.Ubicacion;
      if (body?.Actual !== undefined) row.actual = body.Actual;
    }
    return success();
  }
  if (path === '/experience/delete') {
    const id = body?.ID_Experiencia ?? body?.id_experiencia;
    store.experience = store.experience.filter((e) => e.id_experiencia !== id);
    return success();
  }
  if (path === '/experience/sync') return success();

  // ---- email ------------------------------------------------------------
  if (path === '/email/user') {
    const p = person(targetId);
    return ok(
      p
        ? [{ ID_Correo: `demo-mail-${p.id_usuario}`, Correo: p.email, ID_Usuario: p.id_usuario, Tipo: 'Trabajo' }]
        : []
    );
  }
  if (path === '/email/add' || path === '/email/delete') return success();

  // ---- projects ---------------------------------------------------------
  if (path === '/user/proyectos') {
    const status = searchParams.get('status') || 'active';
    return ok(userProjects(targetId, status === 'active'));
  }
  if (path === '/project-lead/proyectos') {
    return ok(
      store.projects.filter((p) => p.activo).map((p) => projectPayload(p.id_proyecto, DEMO_USER_ID))
    );
  }
  if (path === '/people-lead/users') {
    return ok({ users: store.people.map((p) => adminUserRow(p.id_usuario)) });
  }
  if (path === '/project-lead/users') {
    return ok(store.people.map((p) => adminUserRow(p.id_usuario)));
  }
  if (path === '/project-manager/proyectos' && method === 'GET') {
    return ok(store.projects.map((p) => projectPayload(p.id_proyecto)));
  }
  if (path === '/project-manager/proyectos' && method === 'POST') {
    const id = nextId('demo-proy');
    store.projects.push({
      id_proyecto: id,
      titulo: body?.titulo ?? 'Nuevo proyecto',
      descripcion: body?.descripcion ?? '',
      id_cliente: body?.id_cliente ?? store.clients[0].id_cliente,
      id_projectlead: body?.id_projectlead ?? 'demo-user-mateo-fernandez',
      fecha_inicio: body?.fecha_inicio ?? '2026-09-25',
      fecha_fin: body?.fecha_fin ?? null,
      activo: true,
      horas_totales: body?.horas_totales ?? 1000,
      color: '#A100FF',
    });
    return created(projectPayload(id));
  }
  if (path === '/project-manager/clients' && method === 'GET') return ok(store.clients);
  if (path === '/project-manager/clients' && method === 'POST') {
    const client = {
      id_cliente: nextId('demo-cliente'),
      nombre: body?.nombre ?? 'Nuevo cliente',
      direccion: body?.direccion ?? null,
      telefono: body?.telefono ?? null,
      correo: body?.correo ?? null,
      url_logo: null,
    };
    store.clients.push(client);
    return created(client);
  }
  if (path === '/project-manager/roles') return ok(store.roles);
  if (path.startsWith('/project-manager/proyectos/')) {
    const id = path.split('/')[3];
    if (path.endsWith('/roles')) return ok(store.roles);
    if (method === 'DELETE') {
      const p = store.projects.find((x) => x.id_proyecto === id);
      if (p) p.activo = false;
      return ok({ message: 'Project archived successfully' });
    }
    if (method === 'GET') return ok(projectPayload(id));
    const p = store.projects.find((x) => x.id_proyecto === id);
    if (p) {
      if (body?.titulo !== undefined) p.titulo = body.titulo;
      if (body?.descripcion !== undefined) p.descripcion = body.descripcion;
      if (body?.horas_totales !== undefined) p.horas_totales = body.horas_totales;
      if (body?.fecha_fin !== undefined) p.fecha_fin = body.fecha_fin;
    }
    return ok(projectPayload(id));
  }
  if (path.startsWith('/project-lead/proyectos/')) {
    const id = path.split('/')[3];
    if (path.endsWith('/hours')) {
      for (const entry of body?.assignments ?? body?.hours ?? []) {
        const row = store.assignments.find(
          (a) => a.id_proyecto === id && a.id_usuario === entry.id_usuario
        );
        if (row && typeof entry.horas === 'number') row.horas = entry.horas;
      }
      return success();
    }
    if (path.endsWith('/change-user')) {
      const row = store.assignments.find(
        (a) => a.id_proyecto === id && a.id_usuario === body?.oldUserId
      );
      if (row && body?.newUserId) row.id_usuario = body.newUserId;
      return success();
    }
    return success();
  }

  // ---- notes ------------------------------------------------------------
  if (path === '/notes' && method === 'GET') {
    const rows = [...store.notes]
      .filter((n) => n.id_usuario === DEMO_USER_ID)
      .sort(
        (a, b) =>
          Number(b.is_pinned) - Number(a.is_pinned) ||
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    return ok(rows.map((n) => dbNoteToNote(n as NoteDB)));
  }
  if (path === '/notes' && method === 'POST') {
    const now = new Date().toISOString();
    const row = {
      id_nota: nextId('demo-nota'),
      id_usuario: DEMO_USER_ID,
      title: body?.title ?? 'Nueva nota',
      content: body?.content ?? '',
      category: body?.category ?? 'personal',
      priority: body?.priority ?? 'media',
      created_at: now,
      updated_at: now,
      is_pinned: Boolean(body?.isPinned),
    };
    store.notes.unshift(row as (typeof store.notes)[number]);
    return created(dbNoteToNote(row as NoteDB));
  }
  if (path.startsWith('/notes/')) {
    const id = path.split('/')[2];
    const row = store.notes.find((n) => n.id_nota === id);
    if (!row) return { status: 404, body: { error: 'Note not found' } };
    if (method === 'DELETE') {
      store.notes = store.notes.filter((n) => n.id_nota !== id);
      return success();
    }
    if (body?.title !== undefined) row.title = body.title;
    if (body?.content !== undefined) row.content = body.content;
    if (body?.category !== undefined) row.category = body.category;
    if (body?.priority !== undefined) row.priority = body.priority;
    if (body?.isPinned !== undefined) row.is_pinned = body.isPinned;
    row.updated_at = new Date().toISOString();
    return ok(dbNoteToNote(row as NoteDB));
  }

  // ---- notifications ----------------------------------------------------
  if (path === '/notifications' && method === 'GET') {
    return ok(
      store.notifications
        .filter((n) => n.id_usuario === DEMO_USER_ID)
        .map((n) => ({
          id: n.id,
          title: n.title,
          message: n.message,
          date: n.date,
          read: n.read,
          type: n.type,
        }))
    );
  }
  if (path === '/notifications' && method === 'PATCH') {
    const row = store.notifications.find((n) => n.id === body?.notificationId);
    if (row) row.read = Boolean(body?.markAsRead);
    return success();
  }
  if (path === '/notifications' && method === 'POST') {
    if (body?.markAllAsRead) {
      let updated = 0;
      for (const n of store.notifications) {
        if (!n.read) {
          n.read = true;
          updated += 1;
        }
      }
      return ok({ success: true, updated });
    }
    if (body?.getStats) {
      const mine = store.notifications.filter((n) => n.id_usuario === DEMO_USER_ID);
      return ok({
        success: true,
        stats: { total: mine.length, unread: mine.filter((n) => !n.read).length },
      });
    }
    return success();
  }
  if (path.startsWith('/notifications/')) return success();

  // ---- feedback ---------------------------------------------------------
  if (path === '/retroalimentacion' && method === 'GET') {
    return ok({ success: true, data: store.feedback.filter((f) => f.id_usuario === targetId) });
  }
  if (path === '/retroalimentacion' && method === 'POST') {
    store.feedback.unshift({
      id_retroalimentacion: nextId('demo-retro'),
      id_usuario: body?.id_usuario ?? DEMO_USER_ID,
      id_autor: body?.id_autor ?? DEMO_USER_ID,
      id_proyecto: body?.id_proyecto ?? store.projects[0].id_proyecto,
      mensaje: body?.mensaje ?? '',
      valoracion: body?.valoracion ?? 5,
      fecha: new Date().toISOString(),
      categoria: body?.categoria ?? 'General',
    });
    return success();
  }
  if (path === '/retroalimentacion/enhanced') return ok({ data: enhancedFeedback(targetId) });
  if (path === '/retroalimentacion/stats') return ok({ data: feedbackStats(targetId) });

  // ---- trajectory -------------------------------------------------------
  if (path === '/trajectory/list') return ok({ success: true, paths: trajectoryPaths(DEMO_USER_ID) });
  if (path === '/trajectory/add') return ok({ success: true, id_path: nextId('demo-path') });
  if (path === '/trajectory/path-completion') {
    const target = store.paths.find((p) => p.id_path === body?.id_path);
    if (target) {
      for (const nivel of target.niveles) {
        for (const cert of nivel.certificados) {
          if (cert.id_certificado === body?.id_certificado) cert.completado = Boolean(body?.completado);
        }
      }
    }
    // The page reads `data.certificates.length`, so this key must always exist.
    return ok({ success: true, certificates: [] });
  }

  // ---- admin ------------------------------------------------------------
  if (path === '/admin/users/list') {
    return ok({ users: store.people.map((p) => adminUserRow(p.id_usuario)) });
  }
  if (path === '/admin/levels/list') {
    return ok(
      Object.values(LEVEL_BY_KEY).map((level) => ({ ...level, descripcion: level.titulo }))
    );
  }
  if (path === '/admin/leads/list') {
    return ok(
      store.people.filter((p) => p.nivel === 'people-lead').map((p) => adminUserRow(p.id_usuario))
    );
  }
  if (path === '/admin/leads/assign') {
    for (const item of body?.assignments ?? []) {
      const p = person(item.id_usuario);
      if (p) p.id_peoplelead = item.id_peoplelead ?? null;
    }
    return ok({ success: true, results: body?.assignments ?? [] });
  }
  if (path === '/admin/users/delete') {
    const id = body?.userId ?? body?.id_usuario;
    store.people = store.people.filter((p) => p.id_usuario !== id);
    return success();
  }
  if (path.startsWith('/admin/users/') || path.startsWith('/admin/maintenance/')) return success();

  // ---- agents -----------------------------------------------------------
  if (path === '/kit-agent/assign' || path === '/kit-agent/test') {
    const roleIds = Object.keys(DEMO_ROLE_REQUIREMENTS).slice(0, 4);
    const assignments = roleIds.map((roleId, index) => {
      const roleDef = store.roles.find((r) => r.id_rol === roleId);
      const candidate = store.people[(index + 1) % store.people.length];
      return {
        rol_id: roleId,
        rol_nombre: roleDef?.nombre ?? 'Rol',
        empleado_id: candidate.id_usuario,
        empleado_nombre: `${candidate.nombre} ${candidate.apellido}`,
        score: Number((0.92 - index * 0.07).toFixed(2)),
        num_evaluaciones: store.people.length,
      };
    });
    return ok({ success: true, assignments, tiempo_total: 1.24 });
  }
  if (path === '/soft-agent/optimize') {
    return ok({
      success: true,
      trayectoria_id: 'demo-path-cloud',
      trayectoria_nombre: 'Arquitecta de Soluciones Cloud',
      niveles: store.paths[0].niveles.map((n) => ({
        nivel: n.numero,
        nombre: `Nivel ${n.numero}`,
        certificados: n.certificados.map((c) => c.id_certificado),
      })),
      score_total: 0.87,
      num_evaluaciones: store.certificateCatalog.length,
    });
  }

  // ---- fallback ---------------------------------------------------------
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[demo] unhandled endpoint: ${method} ${path}`);
  }
  return method === 'GET' ? ok([]) : success();
}
