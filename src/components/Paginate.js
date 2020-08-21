import React from "react";
import { Button, Box, Text, IconButton } from "@chakra-ui/core";

const BreakLine = () => {
  return <Text display="inline-block">...</Text>;
};

const NumberButton = ({ active = null, ...props }) => {
  return (
    <Button
      mr={1}
      variantColor="teal"
      {...props}
      variant={active ? "solid" : "ghost"}
    ></Button>
  );
};

function Paginate({ pageCount, page, setPage }) {
  return (
    <Box>
      <IconButton
        variant="ghost"
        icon="chevron-left"
        mr={3}
        variantColor="teal"
        onClick={() => setPage(page - 1)}
        isDisabled={page === 1 || pageCount === 0}
      ></IconButton>
      {pageCount > 11 ? (
        <>
          {Array.from(new Array(3).keys()).map((k) => (
            <NumberButton
              key={k + 1}
              onClick={() => setPage(k + 1)}
              active={k + 1 === page}
            >
              {k + 1}
            </NumberButton>
          ))}
          {page >= 7 && page <= pageCount - 6 ? (
            <>
              <BreakLine>...</BreakLine>
              {Array.from(new Array(3).keys()).map((k) => {
                const n = Math.floor(page - (1 - k));
                return (
                  <NumberButton
                    key={n}
                    onClick={() => setPage(n)}
                    active={n === page}
                  >
                    {n}
                  </NumberButton>
                );
              })}
              <BreakLine>...</BreakLine>
            </>
          ) : page < 7 ? (
            <>
              {Array.from(new Array(3).keys()).map((k) => (
                <NumberButton
                  key={k + 4}
                  onClick={() => setPage(k + 4)}
                  active={k + 4 === page}
                >
                  {4 + k}
                </NumberButton>
              ))}
              <BreakLine>...</BreakLine>
            </>
          ) : page > pageCount - 6 ? (
            <>
              <BreakLine>...</BreakLine>
              {Array.from(new Array(3).keys()).map((k) => {
                const n = pageCount - 3 - (2 - k);
                return (
                  <NumberButton
                    key={n}
                    onClick={() => setPage(n)}
                    active={n === page}
                  >
                    {n}
                  </NumberButton>
                );
              })}
            </>
          ) : null}
          {Array.from(new Array(3).keys()).map((k) => {
            const n = pageCount - (2 - k);
            return (
              <NumberButton
                key={n}
                onClick={() => setPage(n)}
                active={n === page}
              >
                {n}
              </NumberButton>
            );
          })}
        </>
      ) : (
        <>
          {Array.from(new Array(pageCount).keys()).map((k) => (
            <NumberButton
              onClick={() => setPage(k + 1)}
              active={k + 1 === page}
              key={k + 1}
            >
              {k + 1}
            </NumberButton>
          ))}
        </>
      )}

      <IconButton
        variant="ghost"
        icon="chevron-right"
        ml={3}
        variantColor="teal"
        onClick={() => {
          setPage(page + 1);
        }}
        isDisabled={page === pageCount || pageCount === 0}
      ></IconButton>
    </Box>
  );
}

export default Paginate;
