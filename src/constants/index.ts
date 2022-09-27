import { IRequestPagination } from '@/types/interface/index.interface';
import { TableColumnsType } from 'ant-design-vue';

export const TOKEN_DEFAULT_ICON = new URL('../assets/token-default.png', import.meta.url).href;
export const CHAIN_DEFAULT_ICON = new URL('../assets/home/chain-default.png', import.meta.url).href;
export const RELAYER_DEFAULT_ICON = new URL('../assets/relayers/default.png', import.meta.url).href;
export const TIP_ICON = new URL('../assets/tip.png', import.meta.url).href;

export const menus = [
    {
        label: 'Home',
        value: 'Home'
    },
    {
        label: 'Transfers',
        value: 'Transfers'
    },
    {
        label: 'Tokens',
        value: 'Tokens'
    },
    {
        label: 'Chains',
        value: 'Chains'
    },
    {
        label: 'Channels',
        value: 'Channels'
    },
    {
        label: 'Relayers',
        value: 'Relayers'
    }
];

export const PAGE_PARAMETERS = {
    tx: 'tx',
    chains: 'chains',
    transfers: 'transfers',
    tokens: 'tokens',
    ibcToken: 'ibcToken',
    // home 页跳转参数中判断 包含的是 channel， 非 channels，[ibcStatisticsChannelsDefault]
    channel: 'channel',
    channels: 'channels',
    relayers: 'relayers',
    denom: 'denom'
};

export const MSG_DESC = {
    chains: 'Chains',
    channels_24hr: 'Channel Pairs - Active(24hr)',
    channel_all: 'Channel Pairs - All',
    channel_opened: 'Channel Pairs - Open',
    channel_closed: 'Channel Pairs - Closed',
    base_denom_all: 'IBC Tokens - Tokens by Base Denom',
    tx_24hr_all: 'IBC Token Transfers - Recent(24hr)',
    tx_all: 'IBC Token Transfers - All',
    tx_success: 'IBC Token Transfers - Success',
    tx_failed: 'IBC Token Transfers - Failed'
};

export const txStatusNumber = {
    defaultStatus: '1,2,3,4',
    successStatus: '1',
    failedStatus: '2,4'
};
export const dayTime = '24';

export const anchorsDatas = [
    {
        title: 'A-E',
        collection: ['A', 'B', 'C', 'D', 'E']
    },
    {
        title: 'F-J',
        collection: ['F', 'G', 'H', 'I', 'J']
    },
    {
        title: 'K-O',
        collection: ['K', 'L', 'M', 'N', 'O']
    },
    {
        title: 'P-T',
        collection: ['P', 'Q', 'R', 'S', 'T']
    },
    {
        title: 'U-Z',
        collection: ['U', 'V', 'W', 'X', 'Y', 'Z']
    },
    {
        title: '#',
        collection: ['#']
    }
];
export const statisticsName = {
    chains_24hr: 'Active IBC Chains',
    chain_all: 'All IBC Chains',
    channels_24hr: 'Active',
    channel_all: 'All',
    channel_opened: 'Open',
    channel_closed: 'Closed',
    denom_all: 'Tokens by Denom',
    base_denom_all: 'Tokens by Base Denom',
    tx_24hr_all: 'Recent',
    tx_all: 'All',
    tx_success: 'Success',
    tx_failed: 'Failed'
};

export const ibcStatisticsChainsDefault = {
    chains_24hr: {
        statistics_name: 'chains_24hr',
        count: 0
    },
    chain_all: {
        statistics_name: 'chain_all',
        count: 0
    }
};

export const ibcStatisticsChannelsDefault = {
    channels_24hr: {
        statistics_name: 'channels_24hr',
        count: 0
    },
    channel_all: {
        statistics_name: 'channel_all',
        count: 0
    },
    channel_opened: {
        statistics_name: 'channel_opened',
        count: 0
    },
    channel_closed: {
        statistics_name: 'channel_closed',
        count: 0
    }
};

export const ibcStatisticsDenomsDefault = {
    denom_all: {
        statistics_name: 'denom_all',
        count: 0
    },
    base_denom_all: {
        statistics_name: 'base_denom_all',
        count: 0
    }
};

export const ibcStatisticsTxsDefault = {
    tx_24hr_all: {
        statistics_name: 'tx_24hr_all',
        count: 0
    },
    tx_all: {
        statistics_name: 'tx_all',
        count: 0
    },
    tx_success: {
        statistics_name: 'tx_success',
        count: 0
    },
    tx_failed: {
        statistics_name: 'tx_failed',
        count: 0
    }
};

export const ageTimerInterval = 1000;

export const ibcTxStatus = {
    SUCCESS: 1,
    FAILED: 2,
    PROCESSING: 3,
    REFUNDED: 4,
    SETTING: 5
};

export const ibcTxStatusDesc = [
    {
        label: 'Success',
        status: 1
    },
    {
        label: 'Processing',
        status: 3
    },
    {
        label: 'Failed',
        status: 2
    }
];

export const channelsStatus = {
    channelOpenedStatus: '1',
    channelClosedStatus: '2'
};

export enum currentMenuType {
    active = 'active',
    inactive = 'inactive',
    all = 'all'
}

export const chainMenus: { label: string; value: currentMenuType }[] = [
    {
        label: 'Active',
        value: currentMenuType.active
    },
    {
        label: 'Inactive',
        value: currentMenuType.inactive
    },
    {
        label: 'All',
        value: currentMenuType.all
    }
];

export const ibcTxStatusSelectOptions = [
    {
        title: 'All Status',
        value: JSON.stringify(['1', '2', '3', '4'])
    },
    {
        title: 'Success',
        value: JSON.stringify(['1'])
    },
    {
        title: 'Processing',
        value: JSON.stringify(['3'])
    },
    {
        title: 'Failed',
        value: JSON.stringify(['2', '4'])
    }
];
export const transfersStatusOptions = {
    DEFAULT_OPTIONS: ['1', '2', '3', '4'],
    SUCCESS_OPTIONS: ['1'],
    FAILED_OPTIONS: ['2', '4'],
    PROCESSING_OPTIONS: ['3']
};

export const transferTableColumn: TableColumnsType = [
    {
        dataIndex: 'token',
        slots: { customRender: 'token', title: 'customTitle' },
        width: 200
        // ellipsis: true,
    },
    {
        title: 'From TxHash',
        dataIndex: 'hashOut',
        slots: { customRender: 'hashOut' },
        width: 160
    },
    {
        title: 'From',
        dataIndex: 'out',
        slots: { customRender: 'out' }
    },
    {
        title: 'Status',
        dataIndex: 'status',
        slots: { customRender: 'status' },
        width: 180,
        align: 'center'
    },
    {
        title: 'To',
        dataIndex: 'in',
        slots: { customRender: 'in' }
    },
    {
        title: 'To TxHash',
        dataIndex: 'hashIn',
        slots: { customRender: 'hashIn' },
        width: 160
    },
    {
        title: 'Create Time',
        dataIndex: 'time',
        slots: { customRender: 'time' },
        width: 180
    },
    {
        title: 'End Time',
        dataIndex: 'endTime',
        slots: { customRender: 'endTime' },
        width: 180
    }
];

export const unAuthed = 'Others';

export const defaultTitle = {
    defaultStatus: 'All Status',
    defaultChains: 'All Chains',
    defaultTokens: 'All Tokens'
};

export const selectedType = {
    chain: 'chain'
};
export const unknownSymbol = 'unknown';

export const CHAINNAME = {
    COSMOSHUB: 'Cosmos Hub',
    IRISHUB: 'IRIS Hub'
};

export const UNKNOWN = 'Unknown';
export const thousandDecimal = 0.0001;

export const SYMBOL = {
    ATOM: 'ATOM',
    IRIS: 'IRIS'
};

export const COPYRIGHT = `Copyright © ${new Date().getFullYear()} IOBScan. All Rights Reserved.`;
export const ICON_LINK = [
    {
        groupName: 'Github',
        iconName: 'icon-github',
        iconLink: 'https://github.com/irisnet'
    },
    {
        groupName: 'Telegram',
        iconName: 'icon-telegram',
        iconLink: 'https://t.me/irisnetwork'
    },
    {
        groupName: 'Medium',
        iconName: 'icon-medium',
        iconLink: 'https://medium.com/irisnet-blog'
    },
    {
        groupName: 'Twitter',
        iconName: 'icon-tweeter',
        iconLink: 'https://twitter.com/irisnetwork'
    }
];

export const NEED_CUSTOM_COLUMN = {
    tokens: [
        'base_denom',
        'price',
        'chain_id',
        'supply',
        'ibc_transfer_amount',
        'ibc_transfer_txs',
        'chains_involved'
    ],
    ibcToken: ['denom', 'chain_id', 'ibc_hops', 'amount', 'receive_txs'],
    chains: ['chain_id', 'channels', 'relayers', 'ibc_tokens', 'ibc_tokens_value', 'transfer_txs'],
    channels: [
        'chain_a',
        'status',
        'chain_b',
        'operating_period',
        'last_updated',
        'ibc_transfer_txs'
    ],
    relayers: [
        'relayer_name',
        'chain_a',
        'status',
        'chain_b',
        'update_time',
        'txs_success_rate',
        'transfer_total_txs'
    ]
};

export const BASE_PARAMS: IRequestPagination = {
    use_count: false,
    page_num: 1,
    page_size: 1000
};

export const AxiosTimeout = 15000;

export const CHAIN_DEFAULT_VALUE = 'allchain';

export const TOTAL_BOUND = 500000;

export const BACK_TOP_NUM = 2064;

// 默认情况下展示的文案
export const DEFAULT_DISPLAY_TEXT = '--';
