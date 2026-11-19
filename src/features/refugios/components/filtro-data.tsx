import { Segmentos } from '@/components/ui';
import { type DataApi, formatarDataLonga, formatarRotuloDoDia } from '@/utils/date';

type FiltroDataProps = {
  hoje: DataApi;
  datas: DataApi[];
  selecionada: DataApi;
  onSelecionar: (data: DataApi) => void;
};

export function FiltroData({ hoje, datas, selecionada, onSelecionar }: FiltroDataProps) {
  return (
    <Segmentos
      segmentos={datas.map((data) => ({
        valor: data,
        rotulo: formatarRotuloDoDia(data, hoje),
        rotuloAcessivel: formatarDataLonga(data),
      }))}
      selecionado={selecionada}
      onSelecionar={onSelecionar}
    />
  );
}
