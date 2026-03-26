import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';
import { SiteContent, Client } from '../types';

interface Props {
  content: SiteContent;
  dark: boolean;
  onAddClient: (client: Client) => void;
  onUpdateClientAtomic: (id: string, updates: Partial<Client>) => void;
  onDeleteClient: (id: string) => void;
  onUpdate: (key: keyof SiteContent, value: string) => void;
}

export function Clients({ content, dark }: Props) {
  const { ref, visible } = useAnimateOnScroll(0.05);

  return (
    <section id="companies" className={`py-24 transition-colors duration-300 ${dark ? 'bg-slate-950' : 'bg-white'}`}>
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`mb-16 text-center transition-all duration-700 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <span className="mb-3 inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-blue-600">
            Associated Companies
          </span>
          <h2 className={`text-3xl font-black sm:text-4xl ${dark ? 'text-white' : 'text-slate-950'}`}>
            Trusted by leading brands and enterprise teams.
          </h2>
          <p className={`mt-3 text-lg ${dark ? 'text-slate-400' : 'text-slate-600'}`}>
            A clean proof section keeps the home page professional while showing who the company works with.
          </p>
        </div>

        <div className={`grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 transition-all duration-700 ${visible ? 'opacity-100' : 'translate-y-4 opacity-0'}`}>
          {content.clients.map((client, i) => (
            <div
              key={client.id}
              className={`group flex flex-col items-center justify-center rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${dark
                ? 'border-slate-800 bg-slate-900/60 hover:border-blue-500/50 hover:bg-slate-900'
                : 'border-slate-100 bg-white hover:border-blue-200 hover:shadow-blue-500/5'
              }`}
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              <div className="flex h-20 w-full items-center justify-center">
                {client.image ? (
                  <img
                    src={client.image}
                    alt={client.name}
                    className="max-h-16 max-w-full object-contain opacity-75 transition-all group-hover:scale-105 group-hover:opacity-100"
                    loading="lazy"
                  />
                ) : (
                  <div className={`flex h-16 w-full items-center justify-center rounded-lg ${dark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <span className="text-xs text-slate-400">No image</span>
                  </div>
                )}
              </div>
              <span className={`mt-4 text-center text-xs font-semibold leading-tight transition-colors ${dark ? 'text-slate-400 group-hover:text-blue-400' : 'text-slate-600 group-hover:text-blue-600'}`}>
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
