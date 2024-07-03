import { type LLMOutputComponent } from "@llm-ui/react";
import { Button, Card, CardBody, Image, Skeleton } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ConfigContext } from "../../root.tsx";

const query = `
query ($id: ID!) {
  Shopify_product(id: $id) {
    title
    featuredImage {
      url
      altText
    }
  }
}
`;

type ProductResult = {
  title: string;
  featuredImage: {
    altText: string;
    url: string;
  }
};

export const Product: LLMOutputComponent = ({ blockMatch }) => {
  const productId = blockMatch.outputRaw;
  const config = React.useContext(ConfigContext)

  const {data, isError} = useQuery<ProductResult>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const result = await fetch(config.takeshapeApiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.takeshapeApiKey}`
        },
        body: JSON.stringify({
          query,
          variables: {
            id: productId
          }
        })
      });
      const json = await result.json();
      return json.data.Shopify_product;
    },
  });

  if (isError) {
    return <>Error fetching product details</>;
  }
  
  return <Card
    isBlurred
    className="border-none bg-background/60 dark:bg-default-100/50 w-full my-4 h-50"
    shadow="sm"
  >
    <CardBody>
      <div className="grid grid-cols-6 md:grid-cols-12 gap-6 md:gap-4 items-center justify-center">
        <div className="relative col-span-6 md:col-span-4">
          {data ?
            <Image
              alt={data.featuredImage.altText}
              src={data.featuredImage.url}
              className="object-contain h-44 w-44 bg-white"
              shadow="md"
            /> :
            <Skeleton className="rounded-lg w-44 h-44">
              <div className="rounded-lg"></div>
            </Skeleton>
          }
        </div>

        <div className="flex flex-col col-span-6 md:col-span-6">
          {data ? <>
            <h3 className="font-semibold !mt-0">{data.title}</h3>
            <Button>Add To Cart</Button>
          </> :
            <div className="space-y-3">
              <Skeleton className="w-3/5 rounded-lg">
                <div className="h-3 w-3/5 "></div>
              </Skeleton>
              <Skeleton className="w-4/5 rounded-lg">
                <div className="h-3 w-4/5"></div>
              </Skeleton>
              <Skeleton className="w-2/5 rounded-lg">  
                <div className="h-3 w-2/5"></div>
              </Skeleton>
            </div>}
        </div>
      </div>
    </CardBody>
  </Card>
};
