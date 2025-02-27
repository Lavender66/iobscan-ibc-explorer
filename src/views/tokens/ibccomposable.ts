import { axiosCancel } from '@/utils/axios';
import { getIbcTokenListAPI } from '@/api/tokens';
import { useResetSearch } from '@/composables';
import { BASE_PARAMS, PAGE_PARAMETERS, CHAIN_DEFAULT_ICON } from '@/constants';
import { API_CODE } from '@/constants/apiCode';
import { getRestString } from '@/helper/parseStringHelper';
import { IBaseDenom, IIbcChains } from '@/types/interface/index.interface';
import {
    IRequestIbcTokenList,
    IResponseIbcTokenList,
    IResponseIbcTokenListItem,
    TIbcTokenType
} from '@/types/interface/tokens.interface';
import { isNullOrEmpty } from '@/utils/objectTools';
import { urlPageParser } from '@/utils/urlTools';
import { Ref } from 'vue';
import { IDataItem } from '@/components/BjSelect/interface';
import ChainHelper from '@/helper/chainHelper';
import { formatSubTitle } from '@/helper/pageSubTitleHelper';

export const useGetIbcTokenList = () => {
    const route = useRoute();
    const ibcTokenList = ref<IResponseIbcTokenListItem[]>([]);
    const total = ref<number>(0);
    const isHaveParams = ref<boolean>(false);
    const baseDenomQuery = route.query.denom as string | undefined;
    const baseDenomChainIdQuery = route.query.denomChainId as string | undefined;
    const getIbcTokenList = async (params: IRequestIbcTokenList) => {
        const { loading } = params;
        if (loading) {
            loading.value = true;
            delete params.loading;
        }
        let allData = [] as IResponseIbcTokenListItem[];
        const allParams = { ...BASE_PARAMS, ...params };
        const getAllIbcTokenData = async () => {
            try {
                const result = await getIbcTokenListAPI(allParams);
                const { code, data, message } = result;
                if (code === API_CODE.success) {
                    if (!allParams.use_count) {
                        const { items } = data as IResponseIbcTokenList;
                        if (items?.length) {
                            if (items.length < allParams.page_size) {
                                allData = [...(allData || []), ...items];
                                loading && (loading.value = false);
                                ibcTokenList.value = allData;
                            } else {
                                allData = [...(allData || []), ...items];
                                allParams.page_num++;
                                getAllIbcTokenData();
                            }
                        } else {
                            loading && (loading.value = false);
                            ibcTokenList.value = allData;
                            return;
                        }
                    } else {
                        total.value = (data as number) || 0;
                    }
                } else {
                    loading && (loading.value = false);
                    ibcTokenList.value = allData;
                    console.log(message);
                }
            } catch (error) {
                if (!axiosCancel(error)) {
                    loading && (loading.value = false);
                }
                ibcTokenList.value = allData;
                console.log(error);
            } finally {
                if (!params.chain && !params.token_type) {
                    isHaveParams.value = false;
                } else {
                    isHaveParams.value = true;
                }
            }
        };
        getAllIbcTokenData();
    };
    getIbcTokenList({
        ...BASE_PARAMS,
        base_denom: baseDenomQuery,
        base_denom_chain_id: baseDenomChainIdQuery,
        use_count: true
    });
    const subtitle = computed(() => {
        return formatSubTitle(
            isHaveParams.value,
            total.value,
            ibcTokenList.value.length,
            PAGE_PARAMETERS.tokens
        );
    });
    return {
        ibcTokenList,
        getIbcTokenList,
        subtitle,
        baseDenomQuery,
        baseDenomChainIdQuery
    };
};

export const useIbcTokenSelected = (
    ibcChains: Ref<IIbcChains>,
    getIbcBaseDenom: () => Promise<void>,
    getIbcTokenList: (params: IRequestIbcTokenList) => Promise<void>,
    ibcBaseDenoms: Ref<IBaseDenom[]>,
    loading: Ref<boolean>,
    baseDenomQuery: string | undefined,
    baseDenomChainIdQuery: string | undefined
) => {
    const router = useRouter();
    const route = useRoute();
    let pageUrl = '/tokens/details';
    const chainDropdown = ref();
    const statusDropdown = ref();
    const chainIdQuery = route.query.chain as string;
    const statusQuery = route.query.status as TIbcTokenType;
    const searchChain = ref<string | undefined>(chainIdQuery ?? undefined);
    const searchStatus = ref<TIbcTokenType | undefined>(statusQuery);
    const baseDenomAndChainId = `${route.query.denom || ''}${route.query.denomChainId || ''}`;
    const baseDenomInfo = computed(() => {
        const filterData = ibcBaseDenoms.value.filter(
            (item: IBaseDenom) => item.denom + item.chain_id === baseDenomAndChainId
        );
        let symbol = '';
        const filterSymbol = filterData[0]?.symbol;

        if (filterData.length === 0 || isNullOrEmpty(filterSymbol)) {
            symbol = getRestString(route.query.denom, 3, 8) || '';
        } else {
            if (filterSymbol.includes('ibc')) {
                symbol = getRestString(filterSymbol.replace(/ibc\//, ''), 3, 8);
            } else {
                symbol = filterSymbol;
            }
        }
        return {
            symbol,
            imgSrc: filterData[0]?.icon
                ? filterData[0]?.icon
                : new URL('../../assets/token-default.png', import.meta.url).href
        };
    });
    const chainData = computed(() => {
        return [
            {
                children: [
                    {
                        title: 'All Chains',
                        id: '',
                        metaData: null
                    }
                ]
            },
            {
                children: ChainHelper.sortArrsByNames(ibcChains.value?.all || []).map((v: any) => ({
                    title: v.chain_name,
                    id: v.chain_id,
                    icon: v.icon || CHAIN_DEFAULT_ICON,
                    metaData: v
                }))
            }
        ];
    });
    const onSelectedChain = (val?: IDataItem) => {
        (window as any).gtag(
            'event',
            `${router.currentRoute.value.name as string}-点击过滤条件Chain`
        );

        const chain = val?.id;
        searchChain.value = chain as string;
        pageUrl = urlPageParser(pageUrl, {
            key: 'chain',
            value: chain as string
        });
        refreshList();
    };
    const onSelectedStatus = (status?: string | number) => {
        (window as any).gtag(
            'event',
            `${router.currentRoute.value.name as string}-点击过滤条件Token Type`
        );

        searchStatus.value = status as TIbcTokenType;
        pageUrl = urlPageParser(pageUrl, {
            key: 'status',
            value: status as TIbcTokenType
        });
        router.replace(pageUrl);
        refreshList();
    };
    const refreshList = () => {
        getIbcTokenList({
            ...BASE_PARAMS,
            base_denom: baseDenomQuery,
            base_denom_chain_id: baseDenomChainIdQuery,
            chain: searchChain.value,
            token_type: searchStatus.value,
            loading: loading
        });
    };
    onMounted(() => {
        getIbcBaseDenom();
        refreshList();
    });
    return {
        chainDropdown,
        statusDropdown,
        searchChain,
        chainData,
        baseDenomAndChainId,
        onSelectedChain,
        onSelectedStatus,
        baseDenomInfo,
        statusQuery
    };
};

export const useIbcTokenColumnJump = () => {
    const router = useRouter();
    const route = useRoute();
    const goChains = () => {
        router.push('/chains');
    };
    const goTransfer = (chain_id: string, denom: string) => {
        router.push({
            path: '/transfers',
            query: {
                chain: chain_id,
                denom
            }
        });
    };
    const resetSearchCondition = () => {
        const { resetSearch } = useResetSearch();
        const baseDenomQuery = route.query.denom;
        const baseDenomChainIdQuery = route.query.denomChainId;
        let url = `/${PAGE_PARAMETERS.tokens}/details`;
        if (baseDenomQuery || baseDenomChainIdQuery) {
            url += '?';
            baseDenomQuery ? (url += `denom=${baseDenomQuery}`) : '';
            baseDenomChainIdQuery
                ? (url += `${baseDenomQuery ? '&' : ''}denomChainId=${baseDenomChainIdQuery}`)
                : '';
        }
        resetSearch(url);
    };
    return {
        goChains,
        goTransfer,
        resetSearchCondition
    };
};
