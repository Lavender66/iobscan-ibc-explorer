import { IRequestPagination, IResponsePageInfo } from '@/types/interface/index.interface';
import { TRelayerStatus } from '@/types/interface/components/table.interface';
import { Ref } from 'vue';
export type TTxsSuccessRate = string | number | undefined;

export interface IRequestRelayerList extends IRequestPagination {
    chain?: string;
    status?: TRelayerStatus;
    loading?: Ref<boolean>;
}

export interface IResponseRelayerListItem {
    relayer_name: string;
    relayer_icon: string;
    channel_a: string;
    chain_a_address: string;
    channel_b: string;
    chain_b_address: string;
    chain_a: string;
    chain_b: string;
    status: number;
    update_time: number;
    transfer_total_txs: number;
    transfer_success_txs: number;
    transfer_total_txs_value: string;
    currency: string;
}

export interface IRelayersListItem extends IResponseRelayerListItem {
    txs_success_rate?: TTxsSuccessRate;
}

export interface IResponseRelayerList {
    items: IResponseRelayerListItem[];
    page_info: IResponsePageInfo;
}
