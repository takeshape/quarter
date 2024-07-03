import { type LLMOutputComponent } from "@llm-ui/react";
import { Button, Card, CardFooter, CircularProgress, Image } from "@nextui-org/react";
import productExample from "../../images/product-example.png";
import { useQuery } from "@tanstack/react-query";

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

  const {data} = useQuery<ProductResult>({
    queryKey: [productId],
    queryFn: async () => {
      // todo
    },
    
  })

  console.log('blockMatch', data);
  // console.log('data', data);

  if (!data) {
    return <CircularProgress />;
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
