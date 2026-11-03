import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Timeline, formatDayHeading, formatRelativeTime, type TimelineEvent } from "../src/components/Timeline";
import { CheckCircle } from "../src/components/icons";

afterEach(cleanup);

const ZONA = "America/Argentina/Buenos_Aires"; // UTC-3, sin horario de verano
const AHORA = new Date("2026-11-03T15:00:00Z"); // martes 3 de noviembre, 12:00 en Buenos Aires
const opts = { now: AHORA, timeZone: ZONA };

const eventos: TimelineEvent[] = [
  { id: "a", at: "2026-11-03T14:55:00Z", actor: "Marta López", title: "Aprobó el pago", detail: "Transferencia de US$ 49,00", type: "pago" },
  { id: "b", at: "2026-11-03T12:00:00Z", actor: "Sistema", title: "Subió el comprobante" },
  { id: "c", at: "2026-11-02T20:00:00Z", actor: "Julián", title: "Cambió el titular" },
  { id: "d", at: "2026-10-30T13:30:00Z", actor: "Julián", title: "Dio de alta al cliente" },
];

describe("formatRelativeTime", () => {
  it("usa minutos, horas, ayer y días, y la fecha pasadas las semanas", () => {
    const rel = (iso: string) => formatRelativeTime(new Date(iso), opts);
    expect(rel("2026-11-03T14:59:40Z")).toBe("hace un momento");
    expect(rel("2026-11-03T15:00:30Z")).toBe("hace un momento"); // reloj adelantado
    expect(rel("2026-11-03T14:55:00Z")).toBe("hace 5 min");
    expect(rel("2026-11-03T12:00:00Z")).toBe("hace 3 h");
    expect(rel("2026-11-02T20:00:00Z")).toBe("ayer");
    expect(rel("2026-10-30T13:30:00Z")).toBe("hace 4 días");
    expect(rel("2026-09-10T13:30:00Z")).toBe("10 de septiembre");
    expect(rel("2025-12-24T13:30:00Z")).toBe("24 de diciembre de 2025");
  });

  it("'ayer' cuenta días de calendario en la zona, no 24 horas", () => {
    // 23:30 del lunes en Buenos Aires, visto a la 01:00 del martes: pasaron 1,5 h pero es ayer.
    const ahora = new Date("2026-11-03T04:00:00Z");
    expect(formatRelativeTime(new Date("2026-11-03T02:30:00Z"), { now: ahora, timeZone: ZONA })).toBe("ayer");
  });
});

describe("formatDayHeading", () => {
  it("Hoy, Ayer y el día con su nombre", () => {
    const dia = (iso: string) => formatDayHeading(new Date(iso), opts);
    expect(dia("2026-11-03T14:55:00Z")).toBe("Hoy");
    expect(dia("2026-11-02T20:00:00Z")).toBe("Ayer");
    expect(dia("2026-10-30T13:30:00Z")).toBe("viernes 30 de octubre");
    expect(dia("2025-12-24T13:30:00Z")).toBe("miércoles 24 de diciembre de 2025");
  });

  it("agrupa por el día de la zona: 23:30 en Buenos Aires ya es el día siguiente en UTC", () => {
    const evento = new Date("2026-11-04T02:30:00Z");
    const ahora = new Date("2026-11-04T10:00:00Z");
    expect(formatDayHeading(evento, { now: ahora, timeZone: ZONA })).toBe("Ayer");
    expect(formatDayHeading(evento, { now: ahora, timeZone: "UTC" })).toBe("Hoy");
  });
});

describe("Timeline", () => {
  it("muestra quién, qué y cuándo, agrupado por día y del más nuevo al más viejo", () => {
    render(<Timeline events={[...eventos].reverse()} {...opts} />);

    const grupos = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(grupos).toEqual(["Hoy", "Ayer", "viernes 30 de octubre"]);

    const items = screen.getAllByRole("listitem").filter((li) => li.classList.contains("timeline-item"));
    expect(items.map((li) => within(li).getByText(/Aprobó|Subió|Cambió|Dio de alta/).textContent)).toEqual([
      "Aprobó el pago",
      "Subió el comprobante",
      "Cambió el titular",
      "Dio de alta al cliente",
    ]);

    const primero = items[0];
    expect(within(primero).getByText("Marta López")).toBeTruthy();
    expect(within(primero).getByText("Transferencia de US$ 49,00")).toBeTruthy();
    expect(within(primero).getByText("hace 5 min")).toBeTruthy();
  });

  it("el tiempo relativo trae la fecha completa en el tooltip y el instante en <time>", () => {
    render(<Timeline events={eventos} {...opts} />);
    const hora = screen.getByText("hace 5 min");
    expect(hora.tagName).toBe("TIME");
    expect(hora.getAttribute("datetime")).toBe("2026-11-03T14:55:00.000Z");
    expect(hora.getAttribute("title")).toBe("3 de noviembre, 11:55");
  });

  it("en modo absoluto muestra la hora del día (la fecha ya está en el título del grupo)", () => {
    render(<Timeline events={eventos} timeFormat="absolute" {...opts} />);
    expect(screen.getByText("11:55")).toBeTruthy();
    expect(screen.getByText("09:00")).toBeTruthy();
    expect(screen.queryByText("hace 5 min")).toBeNull();
  });

  it("sin agrupar, el modo absoluto incluye la fecha", () => {
    render(<Timeline events={eventos} groupByDay={false} timeFormat="absolute" {...opts} />);
    expect(screen.queryAllByRole("heading")).toHaveLength(0);
    expect(screen.getByText("3 de noviembre, 11:55")).toBeTruthy();
    expect(screen.getByText("30 de octubre, 10:30")).toBeTruthy();
  });

  it("order='asc' pone lo más viejo arriba", () => {
    render(<Timeline events={eventos} order="asc" {...opts} />);
    const titulos = screen.getAllByText(/Aprobó|Subió|Cambió|Dio de alta/).map((n) => n.textContent);
    expect(titulos[0]).toBe("Dio de alta al cliente");
    expect(titulos[3]).toBe("Aprobó el pago");
  });

  it("ícono y tono por tipo, y los del evento mandan", () => {
    const { container } = render(
      <Timeline
        events={[
          { id: "1", at: "2026-11-03T14:55:00Z", title: "Pago aprobado", type: "pago" },
          { id: "2", at: "2026-11-03T14:50:00Z", title: "Pago rechazado", type: "pago", tone: "danger" },
          { id: "3", at: "2026-11-03T14:40:00Z", title: "Sin tipo" },
        ]}
        types={{ pago: { icon: CheckCircle, tone: "success" } }}
        {...opts}
      />,
    );
    const marcadores = container.querySelectorAll(".timeline-marker");
    expect(marcadores[0].className).toContain("timeline-success");
    expect(marcadores[0].querySelector("svg")).toBeTruthy();
    expect(marcadores[1].className).toContain("timeline-danger");
    expect(marcadores[1].querySelector("svg")).toBeTruthy();
    expect(marcadores[2].className).toContain("timeline-neutral");
    expect(marcadores[2].querySelector(".timeline-dot")).toBeTruthy();
    // Los marcadores son decoración: el significado está en el texto.
    expect(marcadores[0].getAttribute("aria-hidden")).toBe("true");
  });

  it("'Ver más' suma de a pageSize, cuenta lo que falta y pasa el foco al primer evento nuevo", () => {
    const muchos: TimelineEvent[] = Array.from({ length: 5 }, (_, i) => ({
      id: String(i),
      at: new Date(AHORA.getTime() - (i + 1) * 60_000),
      title: `Evento ${i + 1}`,
    }));
    render(<Timeline events={muchos} pageSize={2} {...opts} />);

    expect(screen.getAllByText(/^Evento/)).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: "Ver más (3)" }));
    expect(screen.getAllByText(/^Evento/)).toHaveLength(4);
    expect(document.activeElement?.textContent).toContain("Evento 3");

    fireEvent.click(screen.getByRole("button", { name: "Ver más (1)" }));
    expect(screen.getAllByText(/^Evento/)).toHaveLength(5);
    expect(screen.queryByRole("button", { name: /Ver más/ })).toBeNull();
  });

  it("sin eventos muestra el estado vacío, y se puede cambiar el texto", () => {
    const { rerender } = render(<Timeline events={[]} />);
    expect(screen.getByText("Todavía no hay movimientos")).toBeTruthy();

    rerender(<Timeline events={[]} emptyTitle="Sin accesos de soporte" emptyDescription="Nadie entró a ver esta cuenta." />);
    expect(screen.getByText("Sin accesos de soporte")).toBeTruthy();
    expect(screen.getByText("Nadie entró a ver esta cuenta.")).toBeTruthy();

    rerender(<Timeline events={[]} empty={<p>Nada por acá</p>} />);
    expect(screen.getByText("Nada por acá")).toBeTruthy();
  });

  it("una fecha inválida no rompe: el evento va al final, en 'Sin fecha'", () => {
    render(<Timeline events={[{ id: "x", at: "no es fecha", title: "Raro" }, eventos[0]]} {...opts} />);
    const grupos = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(grupos).toEqual(["Hoy", "Sin fecha"]);
    expect(screen.getByText("Raro")).toBeTruthy();
  });

  it("la lista tiene nombre accesible", () => {
    render(<Timeline events={eventos} aria-label="Historial del cliente" {...opts} />);
    expect(screen.getByRole("list", { name: "Historial del cliente" })).toBeTruthy();
  });
});
