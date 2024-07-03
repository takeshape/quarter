import { type LLMOutputComponent } from "@llm-ui/react";
import { Button, Card, CardFooter, CircularProgress, Image, Skeleton } from "@nextui-org/react";
import productExample from "../../images/product-example.png";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ConfigContext } from "../../root.tsx";

// TODO
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
      console.log('json', json);
      return json.data.Shopify_product;
    },
  });

  if (isError) {
    return <>Error fetching product details</>;
  }

  if (!data) {
    return <Card className="w-[200px] space-y-5 p-4" radius="lg">
    <Skeleton className="rounded-lg">
      <div className="h-24 rounded-lg bg-default-300"></div>
    </Skeleton>
    <div className="space-y-3">
      <Skeleton className="w-3/5 rounded-lg">
        <div className="h-3 w-3/5 rounded-lg bg-default-200"></div>
      </Skeleton>
      <Skeleton className="w-4/5 rounded-lg">
        <div className="h-3 w-4/5 rounded-lg bg-default-200"></div>
      </Skeleton>
      <Skeleton className="w-2/5 rounded-lg">  
        <div className="h-3 w-2/5 rounded-lg bg-default-300"></div>
      </Skeleton>
    </div>
  </Card>;
  }

  return <Card isFooterBlurred className="w-ful h-64 my-4">
    <Image
      removeWrapper
      alt={data.featuredImage.altText}
      className="z-0 w-full h-full object-cover"
      src={data.featuredImage.url}
    />
    <CardFooter className="absolute bg-white/60 dark:bg-black/60 bottom-0 z-10 border-t-1 border-default-200 dark:border-default-100">
      <div className="flex flex-grow gap-2">
        <div className="flex flex-col">
          <p className="!mb-0 font-semibold">{data.title}</p>
        </div>
      </div>
      <Button radius="full" size="sm">Add To Cart</Button>
    </CardFooter>
  </Card>
};
